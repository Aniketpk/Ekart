import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCart } from '../../redux/productsSlice';
import { toast } from 'sonner';

const ProductCard = ({ product, loading }) => {
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCart = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            })
            if (res.data.success) {
                toast.success('Product added to cart successfully')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to add product to cart')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col bg-white border border-[#f0f0f0] shadow-ambient rounded-lg overflow-hidden h-full">
                <Skeleton className="w-full aspect-square rounded-none" />
                <div className="p-5 flex flex-col flex-1 gap-2 mt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-full mt-1" />
                    <Skeleton className="h-5 w-2/3" />
                    <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-10" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    const {
        productName = "Unknown Product",
        productPrice = 0,
        productImg = [],
        category = "General",
        brand = ""
    } = product || {};

    const fallbackImage = "https://via.placeholder.com/400x400?text=No+Image";
    const coverImage = productImg.length > 0 ? productImg[0]?.url : fallbackImage;

    return (
        <div
            onClick={() => navigate(`/products/${product._id}`)}
            className="group flex flex-col bg-white border border-[#f0f0f0] shadow-ambient rounded-lg overflow-hidden transition-all duration-300 hover:shadow-ambient-hover hover:-translate-y-1 cursor-pointer h-full"
        >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                <img
                    src={coverImage}
                    alt={productName}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {brand && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#121212] rounded border border-[#e0e0e0]/50 font-mono-label">
                        {brand}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-1.5">
                {/* Category — JetBrains Mono */}
                <span className="font-mono-label text-[#1a237e]">
                    {category}
                </span>

                {/* Title — Hanken Grotesk */}
                <h3 className="font-display font-semibold text-[#121212] text-[15px] line-clamp-2 leading-snug flex-1">
                    {productName}
                </h3>

                {/* Price & CTA */}
                <div className="mt-2 flex items-end justify-between border-t border-[#f0f0f0] pt-4">
                    <div className="flex flex-col">
                        <span className="text-[11px] text-[#5c5c6d] font-medium pb-0.5 font-body">Price</span>
                        <span className="font-display font-bold text-lg text-[#121212]">
                            ₹{productPrice.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                        className="flex items-center justify-center w-10 h-10 bg-[#1a237e] text-white rounded transition-all duration-200 hover:bg-[#0d1759] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:ring-offset-2 active:scale-95 shadow-sm"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard