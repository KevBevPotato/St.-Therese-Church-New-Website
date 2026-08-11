import { Link } from 'wouter';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Saint Therese Church</h3>
            <p className="text-sm opacity-90">
              The Church of St. Therese the Little Flower, serving the Rapid City community with faith, worship, and service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:opacity-80 transition-opacity block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-80 transition-opacity block">
                  About & Staff
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:opacity-80 transition-opacity block">
                  Get Involved
                </Link>
              </li>
              <li>
                <a href="/#mass-schedule" className="hover:opacity-80 transition-opacity">
                  Mass Schedule
                </a>
              </li>
              <li>
                <a href="https://secure.myvanco.com/L-ZAYT/home" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>532 Adams St.<br />Rapid City, SD 57701</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+16053421556" className="hover:opacity-80 transition-opacity">
                  (605) 342-1556
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:sttherese@diorc.org" className="hover:opacity-80 transition-opacity">
                  sttherese@diorc.org
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2026 Saint Therese Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
