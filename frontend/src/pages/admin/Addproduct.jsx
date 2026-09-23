import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setProducts } from '@/redux/productsSlice'

const Addproduct = () => {
  const dispatch = useDispatch();
  const { products } = useSelector(store => store.products);
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    brand: "",
    category: "",
    productDesc: "",
    productImg: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("please select at least one image ");
      requestFormReset;
    }
    productData.productImg.forEach((img) => {
      formData.append("files", img)
    })
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);
        setProductData({
          productName: "",
          productPrice: 0,
          brand: "",
          category: "",
          productDesc: "",
          productImg: []
        });
      }

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='w-full p-6'>
      <Card className='w-full shadow-ambient border-[#f0f0f0]'>
        <CardHeader>
          <CardTitle className="font-display text-[#121212]">Add Product</CardTitle>
          <CardDescription className="font-body text-[#5c5c6d]">Enter Product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-2'>
            <div className='grid gap-2'>
              <Label>Product Name</Label>
              <Input type='text' name="productName" value={productData.productName} onChange={handleChange} placeholder="EX iphone" required />
            </div>
            <div className='grid gap-2'>
              <Label>Price</Label>
              <Input type='number' name="productPrice" value={productData.productPrice} onChange={handleChange} placeholder="EX 1000" required />
            </div>
            <div className='grid grid-col '>
              <div className='grid gap-2'>
                <Label>Brand</Label>
                <Input type='text' name="brand" value={productData.brand} onChange={handleChange} placeholder="EX Apple" required />
              </div>
              <div className='grid gap-2'>
                <Label>Category</Label>
                <Input type='text' name="category" value={productData.category} onChange={handleChange} placeholder="EX Electronics" required />
              </div>
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label>Description</Label>
              </div>
              <Textarea name="productDesc" value={productData.productDesc} onChange={handleChange} placeholder="Enter product description" />
            </div>
            <ImageUpload productData={productData} setProductData={setProductData} />

          </div>
          <CardFooter className='flex-col gap-2 mt-4'>
            <Button disabled={loading} onClick={submitHandler}
              className='w-full mt-6 bg-[#1a237e] hover:bg-[#0d1759] text-white cursor-pointer rounded'
              type="submit">
              {loading ? <span className='flex gap-1 items-center'><Loader2 className='animate-spin' />Please wait...</span> : "Add Product"}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default Addproduct