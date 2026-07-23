import { Link } from 'react-router-dom';
import {
  Wrench, Globe, Share2, MessageCircle, Send, Mail, Phone, MapPin,
} from 'lucide-react';
import { categories } from '../../data/dummyData';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Service<span className="text-primary-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for professional home services. Quality service, verified professionals, at your doorstep.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Share2, MessageCircle, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Top Services</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/services?category=${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact Us', 'Partner with Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Safety', 'Reviews'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-white mb-4 text-sm">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                <span>support@servicehub.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                <span>+91 040 1234 5678</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                <span>HITEC City, Madhapur, Hyderabad, Telangana 500081</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">© 2025 Service Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
