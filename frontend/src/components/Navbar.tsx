import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

// UI-only enhancements: improved styling & responsiveness. Functionality (openSignIn) unchanged.
export default function Navbar() {
  const { openSignIn } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Prices', href: '#prices' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Upper utility bar (optional aesthetic) */}
        <div className="hidden h-9 w-full items-center justify-end gap-4 text-xs font-medium text-gray-500 md:flex">
          <span className="tracking-wide">Mon - Sat: 8:00 - 20:30</span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline tracking-wide">Hotline: (000) 123 456 7</span>
          <div className="ml-4 flex items-center gap-2">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(s => (
              <a
                key={s}
                href={`#${s}`}
                aria-label={s}
                className="group relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-white text-[10px] font-semibold uppercase tracking-wide text-gray-600 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Main navigation row */}
        <div className="flex h-20 w-full items-center justify-between">
          {/* Logo / Brand */}
            <a
              href="/"
              className="relative flex items-center gap-2 text-2xl font-extrabold tracking-tight text-gray-900"
            >
              <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AutoCare
              </span>
              <span className="hidden sm:inline text-gray-400">Service</span>
            </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-2 text-sm uppercase tracking-wide text-gray-600 transition hover:text-gray-900"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => openSignIn()}
              className="relative hidden overflow-hidden rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow md:inline-flex bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Login
            </Button>
            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:text-blue-600 md:hidden"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1.5">
                <span className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <nav className="flex flex-col gap-2 pb-6 pt-2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-700 hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-cyan-500/90 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => {
                openSignIn();
                setMenuOpen(false);
              }}
              className="mt-2 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-semibold uppercase tracking-wider text-white hover:from-blue-500 hover:via-blue-500 hover:to-cyan-400"
            >
              Login
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
