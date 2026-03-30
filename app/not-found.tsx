import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="section-dark min-h-[100dvh] flex items-center justify-center">
      <div className="container-content text-center py-20">
        <p className="font-display text-ember text-8xl font-light mb-6">404</p>
        <h1 className="font-display text-parchment text-3xl md:text-4xl mb-4">
          Lost in the Forest
        </h1>
        <p className="font-body text-parchment/60 text-base mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist — but Wells Gray does. Head back and find what you're after.
        </p>
        <Link href="/" className="btn-ember">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
