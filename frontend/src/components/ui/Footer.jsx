import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Send, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'

const Footer = () => {
    return (
        <footer className='bg-[#121212] text-gray-400 pt-20 pb-10'>
            <div className='max-w-[1280px] mx-auto px-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
                    {/* Brand */}
                    <div className='space-y-4'>
                        <h2 className='font-display text-2xl font-bold text-white'>
                            Ekart
                        </h2>
                        <p className='text-sm leading-relaxed font-body'>
                            Your one-stop shop for the latest electronics, fashion, and home essentials. Experience premium quality at unbeatable prices.
                        </p>
                        <div className='flex gap-4 pt-2'>
                            <a href="#" className='hover:text-[#bdc2ff] transition-colors duration-200'><Facebook className='w-4 h-4' /></a>
                            <a href="#" className='hover:text-[#bdc2ff] transition-colors duration-200'><Twitter className='w-4 h-4' /></a>
                            <a href="#" className='hover:text-[#bdc2ff] transition-colors duration-200'><Instagram className='w-4 h-4' /></a>
                            <a href="#" className='hover:text-[#bdc2ff] transition-colors duration-200'><Linkedin className='w-4 h-4' /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-white font-display font-semibold text-sm uppercase tracking-wider mb-6'>Quick Links</h3>
                        <ul className='space-y-3 text-sm font-body'>
                            <li><Link to="/" className='hover:text-[#bdc2ff] transition-colors duration-200'>Home</Link></li>
                            <li><Link to="/products" className='hover:text-[#bdc2ff] transition-colors duration-200'>Shop All Products</Link></li>
                            <li><Link to="/about" className='hover:text-[#bdc2ff] transition-colors duration-200'>About Us</Link></li>
                            <li><Link to="/contact" className='hover:text-[#bdc2ff] transition-colors duration-200'>Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className='text-white font-display font-semibold text-sm uppercase tracking-wider mb-6'>Contact Us</h3>
                        <ul className='space-y-4 text-sm font-body'>
                            <li className='flex items-start gap-3'>
                                <MapPin className='w-4 h-4 text-[#8ad3d7] shrink-0 mt-0.5' />
                                <span>Jemco Bus Stand , Po-Telco,Jamshudpur  </span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <Phone className='w-4 h-4 text-[#8ad3d7] shrink-0' />
                                <span>+91 98359172022</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <Mail className='w-4 h-4 text-[#8ad3d7] shrink-0' />
                                <span>a922163@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className='text-white font-display font-semibold text-sm uppercase tracking-wider mb-6'>Newsletter</h3>
                        <p className='text-sm mb-4 font-body'>Subscribe for exclusive deals and product updates.</p>
                        <form className='flex flex-col gap-3'>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className='bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#bdc2ff] rounded'
                            />
                            <Button className='bg-[#1a237e] hover:bg-[#0d1759] text-white w-full rounded transition-colors duration-200'>
                                Subscribe <Send className='w-3.5 h-3.5 ml-2' />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className='border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-body'>
                    <p>&copy; {new Date().getFullYear()} Ekart. All rights reserved.</p>
                    <div className='flex gap-6'>
                        <a href="#" className='hover:text-white transition-colors duration-200'>Privacy Policy</a>
                        <a href="#" className='hover:text-white transition-colors duration-200'>Terms of Service</a>
                        <a href="#" className='hover:text-white transition-colors duration-200'>Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
