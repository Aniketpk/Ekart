import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const ProductImg = ({ image }) => {
    const [mainImg, setMainImg] = useState(image?.[0]?.url)
    return (
        <div className='flex gap-5 w-max'>
            <div className='gap-5 flex flex-col'>
                {
                    image?.map((img) => {
                        return (
                            <img onClick={() => setMainImg(img.url)} key={img.url} src={img.url} alt={img.alt} className='cursor-pointer w-20 h-20 rounded border border-[#f0edec] shadow-ambient bg-white hover:border-[#1a237e] transition-colors object-cover' />
                        )
                    })
                }

            </div>
            <Zoom>
                <div className="rounded-lg overflow-hidden border border-[#f0edec] shadow-ambient bg-white">
                    <img src={mainImg} alt="" className='w-[500px] h-[500px] object-cover' />
                </div>
            </Zoom>
        </div>
    )
}

export default ProductImg