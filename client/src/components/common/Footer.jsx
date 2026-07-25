import { Link } from 'react-router-dom';
import { FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaArrowUp } from 'react-icons/fa';
import { COMPANY, FOOTER_LINKS } from '../../utils/constants';
import NewsletterForm from './NewsletterForm.jsx';
import logo from '../../assets/logo.png';

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-secondary text-slate-300 relative">
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className="absolute -top-6 right-6 md:right-12 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-xl hover:-translate-y-1 transition-transform"
      >
        <FaArrowUp />
      </button>

      <div className="container-custom pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt={COMPANY.name} className="h-12 w-12 object-cover rounded-full" />
              <span className="font-bold text-white text-lg">{COMPANY.name}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm">{COMPANY.slogan}</p>
            <div className="flex flex-col gap-3 text-sm">
              <a href={COMPANY.phoneHref} className="flex items-center gap-3 hover:text-accent transition-colors">
                <FaPhoneAlt className="text-accent shrink-0" /> {COMPANY.phoneDisplay}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                <FaEnvelope className="text-accent shrink-0" /> {COMPANY.email}
              </a>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent shrink-0 mt-1" />
                <span>{COMPANY.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-accent shrink-0" /> {COMPANY.hours}
              </div>
            </div>
            <a
              href={COMPANY.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-white transition-colors mt-5"
            >
              <FaInstagram size={18} />
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.quick.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm mb-6">
              {FOOTER_LINKS.support.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-md">
            <h4 className="text-white font-semibold mb-3">Subscribe to our Newsletter</h4>
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {year} {COMPANY.name}. All rights reserved.
          </p>
          <p>
            {COMPANY.developerCredit}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
