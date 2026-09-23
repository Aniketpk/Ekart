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
      const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`, formData, {
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
      const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/delete/${productid}`, {
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
    <div className='w-full p-6 flex flex-col gap-6 min-h-screen'>
      <div className='flex justify-between items-center mb-2'>
        <div className='relative bg-white rounded shadow-sm border border-[#e0e0e0]'>
          <Input type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-[400px] pr-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
          <Search
            className='absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5c6d] size-4' />
        </div>
        <Select onValueChange={(value)=>setSortOrder(value)} >
          <SelectTrigger className="w-[200px] bg-white">
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
              <Card key={product._id || index} className="overflow-hidden bg-white border border-[#f0f0f0] shadow-ambient hover:shadow-ambient-hover transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className='flex items-center gap-6'>
                    <div className='w-20 h-20 flex-shrink-0 bg-[#f5f5f7] rounded border border-[#e0e0e0] flex items-center justify-center overflow-hidden'>
                      {displayImg ? (
                        <img src={displayImg} alt={product.productName} className='w-full h-full object-cover' />
                      ) : (
                        <span className='text-xs text-[#5c5c6d] font-body'>No Image</span>
                      )}
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <h3 className='font-display font-semibold text-lg text-[#121212] line-clamp-1 w-80'>{product.productName}</h3>
                      <p className='text-xs font-mono-label text-[#1a237e] uppercase tracking-wider'>{product.category}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-12'>
                    <h1 className='font-display font-bold text-xl text-[#121212]'>₹{Number(product.productPrice).toLocaleString('en-IN')}</h1>
                    <div className='flex gap-4'>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className='text-green-500 cursor-pointer' />
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
                            <Button onClick={handleSave} type="submit" className="bg-[#1a237e] hover:bg-[#0d1759] text-white">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                      <Dialog>
                        <DialogTrigger asChild>
                          <Trash2 className='text-red-500 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent showCloseButton={false} className="sm:max-w-md bg-white">
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
          <div className='bg-white rounded-lg p-20 text-center border dashed'>
            <p className='text-gray-500'>No products found in the database.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProduct