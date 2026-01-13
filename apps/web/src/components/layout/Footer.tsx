/**
 * Footer Component
 */

import { Link } from "react-router-dom";
import { getCurrentBSDateString, toNepaliDigits } from "@/lib/bs-date";

export function Footer() {
  const currentYear = toNepaliDigits(new Date().getFullYear());

  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">हाम्रो नेपाल</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              नेपालको विश्वसनीय समाचार पोर्टल। राजनीति, अर्थतन्त्र, खेलकुद,
              मनोरञ्जन र अन्य विविध समाचारहरू।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">द्रुत लिङ्कहरू</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  गृहपृष्ठ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  हाम्रो बारेमा
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  सम्पर्क
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white">
                  गोपनीयता नीति
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">समाचार श्रेणीहरू</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/rajniti"
                  className="text-gray-300 hover:text-white"
                >
                  राजनीति
                </Link>
              </li>
              <li>
                <Link
                  to="/category/arthatantra"
                  className="text-gray-300 hover:text-white"
                >
                  अर्थतन्त्र
                </Link>
              </li>
              <li>
                <Link
                  to="/category/khelkud"
                  className="text-gray-300 hover:text-white"
                >
                  खेलकुद
                </Link>
              </li>
              <li>
                <Link
                  to="/category/manoranjan"
                  className="text-gray-300 hover:text-white"
                >
                  मनोरञ्जन
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">सम्पर्क</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>काठमाडौं, नेपाल</li>
              <li>फोन: +९७७-१-४XXXXXX</li>
              <li>इमेल: info@hamronepal.com</li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white"
                aria-label="YouTube"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} हाम्रो नेपाल। सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  );
}
