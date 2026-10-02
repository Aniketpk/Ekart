import { API_BASE_URL } from '@/lib/apiBase'
import { Input } from '@/components/ui/input'
import { Edit, Search, Trash, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productsSlice'
import axios from 'axios'

const AdminProduct = () => {
  const { products } = useSelector(store => store.products)
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder,setSortOrder] = useState("");
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())

  );

  if(sortOrder === "lowToHigh"){
    filteredProducts = [...filteredProducts].sort((a,b)=>a.productPrice - b.productPrice)
  }
  if(sortOrder === "highToLow"){
    filteredProducts = [...filteredProducts].sort((a,b)=>b.productPrice - a.productPrice)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);
    formData.append("productDesc", editProduct.productDesc);

    // Add existing images (public_ids)
    const existingImg = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);
    formData.append("existingImg", JSON.stringify(existingImg));

    // Add new images
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((img) => {
        formData.append("files", img);
      });

    try {
      const res = await axios.put(`${API_BASE_URL}/api/v1/product/update/${editProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        toast.success("Product updated successfully");
        const updatedProductsList = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        );
        dispatch(setProducts(updatedProductsList));
        setEditProduct(null);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  }

  const deleteProductHandler = async (productid) => {
    try {
      const remainingProducts = products.filter((p) => p._id !== productid)
      const res = await axios.delete(`${API_BASE_URL}/api/v1/product/delete/${productid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success("Product deleted successfully");
        dispatch(setProducts(remainingProducts));
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full p-6 flex min-h-screen flex-col gap-6'>
      <div className='flex flex-col justify-between gap-3 mb-2 sm:flex-row sm:items-center'>
        <div className='glass-control relative rounded-xl'>
          <Input type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-[min(68vw,400px)] pr-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
          <Search
            className='absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5c6d] size-4' />
        </div>
        <Select onValueChange={(value)=>setSortOrder(value)} >
          <SelectTrigger className="w-[min(42vw,200px)] bg-white/70">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-4'>
        {products && products.length > 0 ? (
          filteredProducts.map((product, index) => {
            const displayImg = product.productImg && product.productImg.length > 0
              ? (typeof product.productImg[0] === 'string' ? product.productImg[0] : (product.productImg[0].url || ''))
              : '';

            return (
              <Card key={product._id || index} className="glass-surface overflow-hidden border-white/80 shadow-md transition-all hover:shadow-xl">
                <CardContent className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 p-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center sm:gap-5">
                  <div className='contents'>
                    <div className='row-span-2 grid h-16 w-16 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/80 bg-white/55 sm:row-span-1 sm:h-[88px] sm:w-[88px]'>
                      {displayImg ? (
                        <img src={displayImg} alt={product.productName} className='h-full w-full object-contain p-2' />
                      ) : (
                        <span className='text-xs text-[#5c5c6d] font-body'>No Image</span>
                      )}
                    </div>
                    <div className='min-w-0 self-center'>
                      <h3 className='line-clamp-2 break-words font-display text-sm font-semibold text-slate-900 sm:text-base'>{product.productName}</h3>
                      <p className='text-xs font-mono-label text-[#173b5c] uppercase tracking-wider'>{product.category}</p>
                    </div>
                  </div>

                  <div className='col-span-2 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3 sm:col-span-1 sm:justify-end sm:gap-6 sm:border-0 sm:pt-0'>
                    <h1 className='font-display font-bold text-xl text-[#121212]'>₹{Number(product.productPrice).toLocaleString('en-IN')}</h1>
                    <div className='flex items-center gap-3'>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className='cursor-pointer rounded-full bg-white/70 p-2 text-[#173b5c] hover:bg-sky-50' />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Modify the details of {product.productName} here.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="productName">Product Name</Label>
                              <Input
                                id="productName"
                                type="text"
                                name="productName"
                                onChange={handleChange}
                                value={editProduct?.productName || ''}
                                placeholder="e.g. iPhone"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="productPrice">Price (₹)</Label>
                              <Input
                                id="productPrice"
                                type="number"
                                name="productPrice"
                                onChange={handleChange}
                                value={editProduct?.productPrice || ''}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="brand">Brand</Label>
                              <Input
                                id="brand"
                                type="text"
                                name="brand"
                                onChange={handleChange}
                                value={editProduct?.brand || ''}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Input
                                id="category"
                                type="text"
                                name="category"
                                onChange={handleChange}
                                value={editProduct?.category || ''}
                                required
                              />
                            </div>
                            <div className='grid gap-2'>
                              <Label htmlFor="productDesc">Description</Label>
                              <Textarea
                                id="productDesc"
                                name="productDesc"
                                value={editProduct?.productDesc || ''}
                                onChange={handleChange}
                                placeholder="Enter product description"
                              />
                            </div>
                            <div className='grid gap-2'>
                              <Label></Label>
                              <ImageUpload productData={editProduct || { productImg: [] }} setProductData={setEditProduct} />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-[#e0e0e0] text-[#121212]">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSave} type="submit" className="bg-[#173b5c] hover:bg-[#102c47] text-white">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                      <Dialog>
                        <DialogTrigger asChild>
                          <Trash2 className='cursor-pointer rounded-full bg-white/70 p-2 text-red-600 hover:bg-red-50' />
                        </DialogTrigger>
                        <DialogContent showCloseButton={false} className="sm:max-w-md glass-surface-strong">
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete
                              <strong> {product.productName} </strong> from our database.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={() => deleteProductHandler(product._id)}
                              className="bg-red-600 hover:bg-red-700 text-white">
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className='glass-surface rounded-2xl p-12 text-center border-dashed'>
            <p className='text-gray-500'>No products found in the database.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProduct