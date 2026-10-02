import React from 'react'
import { Button } from './button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = ({ product }) => {
  const navigate = useNavigate()
  return (
    <section className="relative isolate min-h-[610px] overflow-hidden bg-[#10243a] pt-24 text-white sm:pt-28 lg:min-h-[700px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_77%_45%,rgba(91,139,179,.42),transparent_33%),linear-gradient(115deg,#10243a_0%,#173b5c_54%,#284963_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d1e30]/50 to-transparent" />
      <div className="relative mx-auto grid min-h-[540px] max-w-[1280px] items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[.92fr_1.08fr] lg:min-h-[610px] lg:py-20">
        <div className="relative z-10 max-w-xl rounded-[2rem] border border-white/20 bg-white/[.09] p-6 shadow-[0_28px_90px_rgba(0,0,0,.18),inset_0_1px_rgba(255,255,255,.2)] backdrop-blur-xl sm:p-9 lg:p-11">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.10] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-sky-100"><Sparkles size={14} /> E-Kart · Curated technology</p>
          <h1 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-.045em]">Technology,<br /><span className="text-sky-200">beautifully useful.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-blue-50/80 sm:text-lg">Discover the electronics in the E-Kart catalog, compare what matters, and find the right fit for your everyday.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate('/products')} className="h-12 rounded-full bg-white px-7 font-semibold text-[#173b5c] shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50">Explore products <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('catalog-categories')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} className="h-12 rounded-full border-white/35 bg-white/[.08] px-7 font-semibold text-white backdrop-blur-md transition hover:bg-white/15">Browse categories</Button>
          </div>
        </div>
        <div className="relative flex min-h-[260px] items-center justify-center md:min-h-[420px]">
          <div className="absolute h-[72%] w-[78%] rounded-[48%] bg-sky-200/20 blur-[75px]" />
          <img src="/hero.png" alt="Curated electronics from the E-Kart catalog" fetchPriority="high" className="relative z-10 max-h-[420px] w-full max-w-[590px] object-contain drop-shadow-[0_36px_30px_rgba(0,0,0,.34)] transition-transform duration-700 hover:scale-[1.025] lg:max-h-[510px]" />
        </div>
      </div>
    </section>
  )
}
export default Hero
