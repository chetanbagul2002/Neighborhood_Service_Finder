import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-bold text-indigo-400 mb-4">NeighborHelp</h3>
          <p className="text-gray-400 text-sm">
            Connecting you with trusted local professionals for all your home and personal service needs.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
            <li><Link to="/services" className="text-gray-400 hover:text-white text-sm">Services</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
            <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* For Professionals */}
        <div>
          <h4 className="text-lg font-semibold mb-4">For Professionals</h4>
          <ul className="space-y-2">
            <li><Link to="/register/provider" className="text-gray-400 hover:text-white text-sm">Join as a Pro</Link></li>
            <li><Link to="/provider-dashboard" className="text-gray-400 hover:text-white text-sm">Provider Dashboard</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={18} />
              <a href="mailto:support@neighborhelp.com" className="hover:text-white text-sm">support@neighborhelp.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} />
              <a href="tel:+911234567890" className="hover:text-white text-sm">+91 123 456 7890</a>
            </li>
            <li className="text-sm">
              123 Service Street, <br/>
              Neighborhood City, State, 12345
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} NeighborHelp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
