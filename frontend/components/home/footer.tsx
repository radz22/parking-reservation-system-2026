"use client";

import { useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import {
  Facebook,
  MapPinned,
  Send,
  SmartphoneNfc,
  Copy,
} from 'lucide-react';

export const Footer = () => {
  const [copyStatus, setCopyStatus] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(`${label} copied!`);
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <footer className="relative py-12 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Image
          src="/img/image.png" 
          alt="Footer background"
          fill
          className="object-cover opacity-90" 
        />
       
        <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm"></div>
      </div>

      {copyStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-xl z-50 animate-bounce">
          {copyStatus}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6">
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
            <p className="text-sm leading-relaxed text-gray-300">
              Your trusted partner for hassle-free parking. We bring real-time
              slot tracking and easy reservations directly to your device.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-dark">
              <li><a href="/user-dashboard" className="hover:text-primary transition">Dashboard</a></li>
              <li><a href="/parking-reserve" className="hover:text-primary transition">Book Reservation</a></li>
              <li><a href="#about-us" className="hover:text-primary transition">About Us</a></li>
              <li><a href="/profile" className="hover:text-primary transition">My Profile</a></li>
              <li><a href="/terms&condition" className="hover:text-primary transition">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm text-dark">
              <li 
                onClick={() => handleCopy("0917-229-1234", "Phone number")}
                className="flex items-center gap-3 cursor-pointer hover:text-white transition group"
                title="Click to copy"
              >
                <SmartphoneNfc className="group-hover:text-blue-400 transition" />
                <span>0917-229-1234</span>
                <Copy size={14} className="opacity-0 group-hover:opacity-50" />
              </li>

              <li 
                onClick={() => handleCopy("support@parkinghub.com", "Email address")}
                className="flex items-center gap-3 cursor-pointer hover:text-white transition group"
                title="Click to copy"
              >
                <Send className="group-hover:text-blue-400 transition" />
                <span>support@parkinghub.com</span>
                <Copy size={14} className="opacity-0 group-hover:opacity-50" />
              </li>

              <li className="flex items-start gap-3">
                <MapPinned />
                <span>Caloocan City, Philippines</span>
              </li>

             <div className="mt-4 w-full h-37.5 rounded-lg overflow-hidden border border-gray-700 grayscale hover:grayscale-0 transition duration-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.24583960016!2d121.03869007851854!3d14.755174949006234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b03042213471%3A0xb79388d00db4b7fd!2sSt.%20Clare%20College%20of%20Caloocan!5e0!3m2!1sen!2sph!4v1776434494230!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <li className="mt-6">
                <a
                  href="https://www.facebook.com/share/17Hb2TWkEa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full transition shadow-lg"
                >
                  <Facebook size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Parking Hub - Smart Parking System. All rights reserved.</p>
          <p>
            Made with <span className="text-red-500">✦</span> by BSCS 3C
          </p>
        </div>
      </div>
    </footer>
  );
};