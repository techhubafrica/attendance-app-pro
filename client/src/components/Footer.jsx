import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ArrowUp,
  BookOpen,
  Clock,
  Users,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 pt-16 border-t-2">
      <div className="bg-blue-600 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Smart Attendance Management, By Tech Hub Africa. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-white hover:text-blue-100 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white hover:text-blue-100 text-sm">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-white hover:text-blue-100 text-sm">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default Footer;