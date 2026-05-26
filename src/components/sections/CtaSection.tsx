"use client"

import Link from 'next/link'

export default function CtaSection() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      <div className="self-stretch px-6 md:px-24 py-12 border-t border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Pradėkite savo DI kelionę šiandien
            </div>
            <div className="self-stretch text-center text-[#605A57] text-base leading-7 font-sans font-medium">
              Susisiekite su mumis ir aptarsime, kaip DI gali padėti jūsų verslui,<br />
              — paprastai, be streso ir žingsnis po žingsnio.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <div className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                <div className="w-44 h-[41px] absolute left-0 top-0 bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
                <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                  Susisiekti
                </div>
              </div>
              <Link
                href="/assessment"
                className="h-10 px-8 rounded-full border border-[#37322F] flex items-center justify-center text-[#37322F] text-[13px] font-medium leading-5 font-sans hover:bg-[#37322F] hover:text-white transition-colors whitespace-nowrap"
              >
                Įvertinti procesus →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
