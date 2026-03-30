// Simple IntersectionObserver-based reveal
// Used as a lightweight alternative to GSAP for non-hero elements
// Respects prefers-reduced-motion

export function initReveal() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
      el.classList.add('visible')
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}
