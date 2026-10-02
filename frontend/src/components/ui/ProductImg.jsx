import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const ProductImg = ({ image, productName = 'Product' }) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const mainImg = selectedImage?.images === image ? selectedImage.url : image?.[0]?.url
    return (
        <div className='flex min-w-0 flex-col-reverse gap-3 sm:flex-row sm:gap-4'>
            <div className='flex gap-3 overflow-x-auto sm:flex-col sm:overflow-x-visible'>
                {
                    image?.map((img, index) => {
                        return (
                            <button type="button" onClick={() => setSelectedImage({ images: image, url: img.url })} key={img.url || index} aria-label={`View product image ${index + 1}`} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white p-1 transition-colors sm:h-[72px] sm:w-[72px] ${mainImg === img.url ? 'border-[#173b5c]' : 'border-slate-200 hover:border-[#173b5c]'}`}><img src={img.url} alt="" className='h-full w-full object-contain' /></button>
                        )
                    })
                }

            </div>
            <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-[1.75rem] border border-white/80 bg-[radial-gradient(ellipse_at_50%_42%,rgba(204,222,237,.58),rgba(247,249,251,.88)_58%,rgba(232,239,245,.8))] p-4 shadow-inner sm:p-6">
                {mainImg ? <Zoom><img src={mainImg} alt={productName} className='h-full w-full object-contain' /></Zoom> : <div className="grid h-full place-items-center text-slate-400">{productName}</div>}
            </div>
        </div>
    )
}

export default ProductImg
