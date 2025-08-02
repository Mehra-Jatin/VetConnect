import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand/Logo */}
        <div>
          <h3 className="text-2xl font-bold text-orange-400 mb-4">VetConnect</h3>
          <p className="text-sm text-gray-400">
            Compassionate care for your furry family members. Book vet appointments online and get expert advice anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/" className="hover:text-orange-400">Home</a></li>
            <li><a href="/about" className="hover:text-orange-400">About Us</a></li>
            <li><a href="/services" className="hover:text-orange-400">Services</a></li>
            <li><a href="/contact" className="hover:text-orange-400">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Pet Consultations</li>
            <li>Vaccination & Care</li>
            <li>Grooming</li>
            <li>Online Appointments</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Get In Touch</h4>
          <p className="text-sm text-gray-300 mb-4">info@vetconnect.com</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-orange-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-orange-400"><Instagram size={20} /></a>
            <a href="#" className="hover:text-orange-400"><Twitter size={20} /></a>
            <a href="mailto:info@vetconnect.com" className="hover:text-orange-400"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} VetConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
