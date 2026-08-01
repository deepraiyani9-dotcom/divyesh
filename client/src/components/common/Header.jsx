import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaChevronDown, FaTimes } from 'react-icons/fa';
import { NAV_LINKS, COMPANY } from '../../utils/constants';
import logo from '../../assets/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navBtnClass = ({ isActive }) => `nav-btn${isActive ? ' active' : ''}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAFBFC] shadow-md py-2.5' : 'bg-[#FAFBFC] py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt={COMPANY.name} className="h-12 w-auto object-contain mix-blend-multiply" />
          <span className="leading-tight">
            <span className="block font-bold text-ink text-lg">{COMPANY.name}</span>
            <span className="block text-[11px] text-muted font-medium -mt-0.5">PVC & UPVC Manufacturers</span>
          </span>
        </Link>

        <nav className="nav-container hidden lg:flex">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button type="button" className="nav-btn">
                  <span>{link.label}</span>
                  <FaChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                  <div className="nav-dropdown bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}
                      >
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={link.to} to={link.to} className={navBtnClass} end={link.to === '/'}>
                <span>{link.label}</span>
              </NavLink>
            )
          )}
        </nav>

        <button
          className="lg:hidden text-ink text-2xl"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <span className="font-bold text-ink text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-2xl text-ink" aria-label="Close menu">
                  <FaTimes />
                </button>
              </div>
              <nav className="p-5 flex flex-col gap-2">
                {NAV_LINKS.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileDropdown((d) => (d === link.label ? null : link.label))}
                        className="nav-btn w-full justify-between"
                      >
                        <span>{link.label}</span>
                        <FaChevronDown
                          size={12}
                          className={`transition-transform ${mobileDropdown === link.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3"
                          >
                            {link.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                onClick={() => setMobileOpen(false)}
                                className="nav-btn w-full text-sm"
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      end={link.to === '/'}
                      className={({ isActive }) => `nav-btn w-full${isActive ? ' active' : ''}`}
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
