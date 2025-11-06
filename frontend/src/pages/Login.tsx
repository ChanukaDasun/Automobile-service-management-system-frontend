// src/pages/LandingPage.tsx
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";

export default function Login() {
  const { openSignIn } = useClerk();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] md:h-[700px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200"
            alt="Luxury Car"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto h-full w-full max-w-7xl px-6">
          <div className="flex h-full items-center">
            {/* Text Content */}
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                Your Premier Auto
                <br />
                Service
              </h1>
              <p className="mt-6 text-lg text-gray-200 max-w-md">
                At AutoCare, we deliver industry-standard luxury and professionalism every time.
              </p>
              <Button
                onClick={() => openSignIn()}
                className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-base"
              >
                Explore now
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
       
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Our Features
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need for efficient vehicle service management
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Schedule your vehicle service appointments online in just a few clicks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your vehicle's service progress and get instant updates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Technicians
              </h3>
              <p className="text-gray-600">
                Professional mechanics with years of experience handling all vehicle types.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We are a modern automotive service center dedicated to providing quality vehicle maintenance and repair services. Our platform streamlines the entire service process from booking to completion.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With experienced technicians and state-of-the-art equipment, we ensure your vehicle receives the best care possible. Our transparent process keeps you informed every step of the way.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Certified and experienced technicians</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Quality parts and service guarantee</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Convenient online booking system</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600">
              Comprehensive automotive care for all makes and models
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Oil Change & Filter Replacement',
              'Brake Service & Repair',
              'Tire Rotation & Replacement',
              'Engine Diagnostics',
              'Battery Service',
              'Air Conditioning Service',
              'Transmission Service',
              'Wheel Alignment',
              'General Maintenance'
            ].map((service) => (
              <div key={service} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Pricing</h2>
            <p className="text-gray-600">
              Transparent and competitive pricing for quality service
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Service</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">Rs. 5,000</p>
              <ul className="space-y-2 text-gray-600">
                <li>• Oil Change</li>
                <li>• Filter Replacement</li>
                <li>• Basic Inspection</li>
                <li>• Fluid Top-up</li>
              </ul>
            </div>

            <div className="bg-blue-600 p-6 rounded-lg border-2 border-blue-600 text-white">
              <div className="text-sm font-semibold mb-2">MOST POPULAR</div>
              <h3 className="text-xl font-semibold mb-2">Standard Service</h3>
              <p className="text-3xl font-bold mb-4">Rs. 12,000</p>
              <ul className="space-y-2">
                <li>• Everything in Basic</li>
                <li>• Brake Inspection</li>
                <li>• Tire Rotation</li>
                <li>• Battery Check</li>
                <li>• AC Performance Check</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Service</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">Rs. 20,000</p>
              <ul className="space-y-2 text-gray-600">
                <li>• Everything in Standard</li>
                <li>• Engine Diagnostics</li>
                <li>• Transmission Check</li>
                <li>• Wheel Alignment</li>
                <li>• Complete Detailing</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">
            *Prices may vary based on vehicle type and specific requirements
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Get in touch with us for any inquiries
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">(000) 123 456 7</p>
              <p className="text-gray-600">Mon - Sat: 8:00 - 20:30</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@autocare.com</p>
              <p className="text-gray-600">support@autocare.com</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Service Street</p>
              <p className="text-gray-600">Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold mb-4">AutoCare Service</h3>
              <p className="text-gray-400 text-sm">
                Professional automotive care and service management platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#prices" className="hover:text-white">Pricing</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Oil Change</li>
                <li>Brake Service</li>
                <li>Engine Diagnostics</li>
                <li>General Maintenance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>(000) 123 456 7</li>
                <li>info@autocare.com</li>
                <li>Mon - Sat: 8:00 - 20:30</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 AutoCare Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
