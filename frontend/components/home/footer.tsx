import { Facebook, MapPinned, Send, SmartphoneNfc } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <span className="text-2xl">🅿️</span>
              <div>
                <h2 className="text-xl font-bold leading-none">Parking Hub</h2>
                <p className="text-xs text-gray-500 uppercase mt-1 tracking-widest">
                  Smart Parking System
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for hassle-free parking. We bring real-time
              slot tracking and easy reservations directly to your device with
              fast and reliable service.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Book Reservation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  My Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <SmartphoneNfc />
                0917-229-1234
              </li>
              <li className="flex items-center gap-3">
                <Send />
                support@parkinghub.com
              </li>
              <li className="flex items-center gap-3">
                <MapPinned />
                Metro Manila, Philippines
              </li>
              <li className="mt-6">
                <a
                  href="#"
                  className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full transition shadow-lg"
                >
                  <Facebook />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Parking Hub - Smart Parking System. All rights reserved.</p>
          <p>
            Made with <span className="text-red-500">✦</span> by BSCS 3C
          </p>
        </div>
      </div>
    </footer>
  );
};
