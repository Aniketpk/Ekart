import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }))
    }
    e.target.value = ""
  }


  const removeImage = (index)=>{
    setProductData((prev)=>{
      const updatedImg = prev.productImg.filter((_,i)=>i !== index)
      return{...prev,productImg:updatedImg}
    })
  }
  return (
    <div className='grid gap-3'>
      <Label>Product Image</Label>
      <Input 
        type='file' 
        id="file-upload" 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFiles} 
      />
      <Button variant="outline" asChild>
        <label htmlFor="file-upload" className='cursor-pointer'>Upload Image</label>
      </Button>
      
      {/* image preview */}
      {productData.productImg.length > 0 && (
        <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
          {productData.productImg.map((file, idx) => {
            let preview
            if (file instanceof File) {
              preview = URL.createObjectURL(file)
            } else if (typeof file === 'string') {
              preview = file
            } else if (file?.url) {
              preview = file.url
            } else {
              return null
            }

            return (
              <Card key={idx} className="relative group overflow-hidden border-none shadow-none">
                <CardContent className="p-0">
                  <img 
                    src={preview} 
                    alt={`Preview ${idx}`} 
                    className='w-full h-32 object-cover rounded-md border' 
                  />
                  {/* remove button */}
                  <button 
                
                    type="button"
                    onClick={() => removeImage(idx)}
                    className='absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80'
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageUpload