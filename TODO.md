# TODO

## Hero dashboard (HeroSection.tsx)

- [ ] Replace placeholder dashboard images with real product screenshots
  - Current images: stock analytics photos from Vercel blob + local files
  - Need: actual screenshots from a real Diteka engagement or a realistic demo
  - Three slots (activeCard 0, 1, 2): audit results, implementation progress, training/results
  - File: `src/components/hero/HeroSection.tsx` — search `{/* Dashboard preview */}`
  - Remove `hidden` class from the wrapper div to re-enable

- [ ] Make dashboard section smaller once real images are in
  - Currently: `h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px]`
  - Reduce to roughly half that height so it reads as a preview, not a full-bleed screenshot
