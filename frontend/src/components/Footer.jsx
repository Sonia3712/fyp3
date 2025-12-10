import React from 'react';
import { 
  Heart, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail,
  Phone
} from 'lucide-react';

const Footer = ({ theme = 'light' }) => {
  // Determine colors based on theme
  const isDarkMode = theme === 'dark';
  
  const footerStyles = {
    background: isDarkMode 
      ? 'linear-gradient(to right, #1a365d, #2d3748)' 
      : 'linear-gradient(to right, #4f46e5, #3730a3)',
    text: isDarkMode ? 'text-gray-200' : 'text-gray-100',
    mutedText: isDarkMode ? 'text-gray-400' : 'text-gray-300',
    cardBackground: isDarkMode ? 'bg-gray-800/30' : 'bg-white/10',
    borderColor: isDarkMode ? 'border-gray-700' : 'border-white/20',
    gradientTop: isDarkMode 
      ? 'linear-gradient(to right, #4f46e5, #0d9488)' 
      : 'linear-gradient(to right, #4f46e5, #0d9488)',
    hoverBg: isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-white/20',
    logoBorder: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    logoGradient: isDarkMode 
      ? 'from-gray-700/50 to-transparent' 
      : 'from-white/50 to-transparent',
    shadowGradient: isDarkMode
      ? 'from-purple-600/20 to-teal-600/20'
      : 'from-purple-500/20 to-teal-500/20',
    borderTop: isDarkMode ? 'border-gray-800' : 'border-white/10'
  };

  return (
    <footer 
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-800'
      }`}
      style={{
        background: footerStyles.background
      }}
    >
      {/* Gradient Border Top */}
      <div 
        className="h-2"
        style={{
          background: footerStyles.gradientTop
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section with Floating Logo Card */}
          <div className="lg:col-span-1">
            <div className="flex items-start space-x-4 mb-6">
              {/* Floating Logo Card */}
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl shadow-lg border ${
                  footerStyles.logoBorder
                } flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  footerStyles.cardBackground
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    footerStyles.logoGradient
                  } rounded-2xl`}></div>
                  <img 
                    src="/logo1.png" 
                    alt="LivestockSync Logo" 
                    className="w-8 h-8 object-contain relative z-10"
                  />
                </div>
                {/* Soft Shadow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  footerStyles.shadowGradient
                } rounded-2xl blur-md opacity-50 -z-10`}></div>
              </div>

              <div>
                <h3 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-white'
                }`}>
                  LivestockSync
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-300'
                }`}>
                  Digital Farming Revolution
                </p>
              </div>
            </div>
            <p className={`text-base leading-relaxed mb-6 ${
              footerStyles.mutedText
            }`}>
              Empowering farmers with intelligent livestock management solutions for modern agriculture.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                    footerStyles.cardBackground
                  } ${footerStyles.hoverBg}`}
                  aria-label={social.label}
                >
                  <social.icon className={`h-4 w-4 ${
                    footerStyles.mutedText
                  }`} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Section */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>
              Product
            </h4>
            <ul className="space-y-3">
              {[
                "Features",
                "Pricing",
                "Mobile App",
                "API Docs"
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`text-base transition-colors duration-200 hover:translate-x-1 inline-block ${
                      footerStyles.mutedText
                    } hover:text-white`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>
              Company
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Our Team", 
                "Careers",
                "Contact"
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`text-base transition-colors duration-200 hover:translate-x-1 inline-block ${
                      footerStyles.mutedText
                    } hover:text-white`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              <div className={`flex items-center text-base ${
                footerStyles.mutedText
              }`}>
                <Mail className="h-4 w-4 mr-2" />
                support@livestocksync.com
              </div>
              <div className={`flex items-center text-base ${
                footerStyles.mutedText
              }`}>
                <Phone className="h-4 w-4 mr-2" />
                +92 300 123 4567
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Security"
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`text-base transition-colors duration-200 hover:translate-x-1 inline-block ${
                      footerStyles.mutedText
                    } hover:text-white`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t pt-6 ${
          footerStyles.borderTop
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className={`text-base ${
                footerStyles.mutedText
              }`}>
                © 2025 LivestockSync. All rights reserved.
              </p>
            </div>
            
            {/* Version */}
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              v2.1.0 • Built with <Heart className="h-3 w-3 inline text-red-400" /> for farmers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;