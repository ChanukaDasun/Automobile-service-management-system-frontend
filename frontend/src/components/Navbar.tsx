import { useState } from 'react';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Roles } from '@/types/globals';
import { Link, useNavigate } from 'react-router-dom';

// UI-only enhancements: improved styling & responsiveness. Functionality (openSignIn) unchanged.
export default function Navbar() {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Get user role, default to 'user' if not set
  const userRole = (user?.publicMetadata?.role as Roles) || Roles.User;
  const isUserRole = user && userRole === Roles.User;

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (userRole === Roles.Admin) return "/admin";
    if (userRole === Roles.Employee) return "/employee";
    return "/user-dashboard";
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Prices', href: '#prices' },
    { label: 'Contact', href: '#contact' }
  ];

  // User-specific navigation links
  const userNavLinks = [
    { label: 'Appointment', href: '/appointment' }
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
            <Link
              to="/"
              className="relative flex items-center gap-2 text-2xl font-extrabold tracking-tight text-gray-900"
            >
              <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AutoCare
              </span>
              <span className="hidden sm:inline text-gray-400">Service</span>
            </Link>

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
            {/* User-specific links */}
            {isUserRole && userNavLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="group relative py-2 text-sm uppercase tracking-wide text-gray-600 transition hover:text-gray-900"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Notification Icon */}
                {isUserRole && (
                  <button
                    onClick={() => navigate('/notification')}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Notifications"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {/* Notification badge - you can conditionally show this based on unread count */}
                    {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
                  </button>
                )}
                
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Dashboard"
                      labelIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      }
                      onClick={() => navigate(getDashboardRoute())}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <Button
                onClick={() => openSignIn()}
                className="relative hidden overflow-hidden rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow md:inline-flex bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Login
              </Button>
            )}
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
            {/* User-specific links in mobile menu */}
            {isUserRole && userNavLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-700 hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-cyan-500/90 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 flex items-center justify-center py-2">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Dashboard"
                      labelIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      }
                      onClick={() => navigate(getDashboardRoute())}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <Button
                onClick={() => {
                  openSignIn();
                  setMenuOpen(false);
                }}
                className="mt-2 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-semibold uppercase tracking-wider text-white hover:from-blue-500 hover:via-blue-500 hover:to-cyan-400"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
