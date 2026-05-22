"use client"

import { useState, useEffect } from "react"

const testimonials = [
  {
    quote:
      "Vos per kelias dienas transformavome savo darbo procesus su AI. Viskas buvo paprasta ir greita — komanda nustebo, kaip greitai pradėjome naudoti naujus įrankius.",
    name: "Tomas Paulauskas",
    company: "Direktorius, UAB Agilis",
    image: "/professional-man-avatar-with-beard-and-glasses-loo.jpg",
  },
  {
    quote:
      "Diteka padėjo mums suprasti, kur AI tikrai gali padėti — ir tai buvo ne ten, kur tikėjomės. Rezultatai viršijo lūkesčius.",
    name: "Rasa Jonikienė",
    company: "Rinkodaros vadovė, Baltica Group",
    image: "/professional-woman-avatar-with-short-brown-hair-an.jpg",
  },
  {
    quote:
      "Mokymai buvo praktiniai ir aiškūs. Dabar visa komanda naudoja AI įrankius kasdien — be techninio jargono ir streso.",
    name: "Mantas Žilinskas",
    company: "IT vadovas, TechNord",
    image: "/professional-person-avatar-with-curly-hair-and-war.jpg",
  },
]

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        setTimeout(() => setIsTransitioning(false), 100)
      }, 300)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigationClick = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTestimonial(index)
      setTimeout(() => setIsTransitioning(false), 100)
    }, 300)
  }

  const current = testimonials[activeTestimonial]

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      <div className="self-stretch px-2 overflow-hidden flex justify-start items-center bg-background border-b border-l-0 border-r-0 border-t-0">
        <div className="flex-1 py-16 md:py-20 flex flex-col md:flex-row justify-center items-end gap-6">
          <div className="self-stretch px-3 md:px-12 justify-center items-start gap-4 flex flex-col md:flex-row">
            <img
              className={`w-48 h-48 rounded-lg object-cover transition-all duration-700 ease-in-out ${
                isTransitioning ? "opacity-60 scale-95" : "opacity-100 scale-100"
              }`}
              src={current.image}
              alt={current.name}
            />
            <div className="flex-1 px-6 py-6 overflow-hidden flex flex-col justify-start items-start gap-6 pb-0 pt-0">
              <div
                className={`self-stretch text-[#49423D] text-2xl md:text-[32px] font-medium leading-10 md:leading-[42px] font-sans h-[200px] md:h-[210px] overflow-hidden line-clamp-5 transition-all duration-700 ease-in-out tracking-tight ${
                  isTransitioning ? "blur-[4px]" : "blur-0"
                }`}
              >
                &ldquo;{current.quote}&rdquo;
              </div>
              <div
                className={`self-stretch flex flex-col justify-start items-start gap-1 transition-all duration-700 ease-in-out ${
                  isTransitioning ? "blur-[4px]" : "blur-0"
                }`}
              >
                <div className="self-stretch text-[rgba(73,66,61,0.90)] text-lg font-medium leading-[26px] font-sans">
                  {current.name}
                </div>
                <div className="self-stretch text-[rgba(73,66,61,0.70)] text-lg font-medium leading-[26px] font-sans">
                  {current.company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pr-6 justify-start items-start gap-[14px] flex">
            <button
              onClick={() => handleNavigationClick((activeTestimonial - 1 + testimonials.length) % testimonials.length)}
              className="w-9 h-9 shadow-[0px_1px_2px_rgba(0,0,0,0.08)] overflow-hidden rounded-full border border-[rgba(0,0,0,0.15)] justify-center items-center gap-2 flex hover:bg-gray-50 transition-colors"
              aria-label="Ankstesnis"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#46413E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
            <button
              onClick={() => handleNavigationClick((activeTestimonial + 1) % testimonials.length)}
              className="w-9 h-9 shadow-[0px_1px_2px_rgba(0,0,0,0.08)] overflow-hidden rounded-full border border-[rgba(0,0,0,0.15)] justify-center items-center gap-2 flex hover:bg-gray-50 transition-colors"
              aria-label="Kitas"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#46413E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
