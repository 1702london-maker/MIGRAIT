import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-white min-h-[60vh] flex items-center justify-center text-center px-5">
      <div>
        <h1 className="font-black text-night text-[40px] md:text-[56px] tracking-[-2px]">
          Page not found.
        </h1>
        <p className="mt-4 text-slate text-lg">The page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block text-electric font-bold">
          Back to home
        </Link>
      </div>
    </div>
  )
}
