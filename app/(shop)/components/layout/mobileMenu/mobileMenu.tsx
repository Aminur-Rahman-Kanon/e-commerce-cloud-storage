'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo Placeholder */}
        <div className="text-xl font-semibold tracking-wide text-gray-700">
          Antorbon
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <Link href="/category" className="hover:text-gray-900">Category</Link>
          <Link href="/about" className="hover:text-gray-900">About Us</Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center gap-6 py-6 text-gray-600">
            <Link href="/" onClick={() => setOpen(false)} className="hover:text-gray-900">Home</Link>
            <Link href="/category" onClick={() => setOpen(false)} className="hover:text-gray-900">Category</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="hover:text-gray-900">About Us</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
