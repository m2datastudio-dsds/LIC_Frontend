import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bell, Mail, Menu, Phone } from 'lucide-react';
import axios from 'axios';

function MainLayout() {
  const location = useLocation();
  const [contact, setContact] = useState({ phone: '+91 98765 43210', email: 'amit@licagent.example' });
  const [notificationCount, setNotificationCount] = useState(0);
  const adminToken = localStorage.getItem('adminToken');
  const insuranceTheme = location.pathname.includes('real-estate') ? 'real-estate-theme' : location.pathname.startsWith('/health-insurance') ? 'health-site-theme' : location.pathname.startsWith('/life-insurance') ? 'life-site-theme' : '';
  useEffect(() => {
    axios.get('http://localhost:5000/api/agent-profile').then((response) => {
      const profile = response.data.data || {};
      setContact((current) => ({ phone: profile.phone || current.phone, email: profile.email || current.email }));
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!adminToken) { setNotificationCount(0); return undefined; }
    const loadCount = async () => {
      try {
        const headers = { Authorization: `Bearer ${adminToken}` };
        const [contacts, enquiries] = await Promise.all([
          axios.get('http://localhost:5000/api/contact', { headers }),
          axios.get('http://localhost:5000/api/enquiries', { headers }),
        ]);
        const unreadContacts = (contacts.data.data || []).filter((item) => item.status === 'NEW').length;
        const unreadEnquiries = (enquiries.data.data || []).filter((item) => item.status === 'NEW').length;
        setNotificationCount(unreadContacts + unreadEnquiries);
      } catch { setNotificationCount(0); }
    };
    loadCount();
    const timer = window.setInterval(loadCount, 30000);
    window.addEventListener('admin-notifications-refresh', loadCount);
    return () => { window.clearInterval(timer); window.removeEventListener('admin-notifications-refresh', loadCount); };
  }, [adminToken, location.pathname]);
  return (
    <div className={`site-shell ${insuranceTheme}`}>
      <header className="topbar">
        <Link className="brand-wrap" to="/" aria-label="LIC Agent home">
          <img className="lic-full-logo" src="/lic-logo-transparent.png" alt="Life Insurance Corporation of India" />
          <img className="star-full-logo" src="/star-health-watermark.svg" alt="Star Health Insurance" />
        </Link>

        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/life-insurance">Life Insurance</Link>
          <Link to="/health-insurance">Health Insurance</Link>
          <Link to="/real-estate">Real Estate</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="nav-actions">
          <div className="header-contact-stack">
            <a className="header-contact-link" href={`tel:${contact.phone.replace(/\s+/g, '')}`}><Phone size={15}/><span>{contact.phone}</span></a>
            <a className="header-contact-link" href={`mailto:${contact.email}`}><Mail size={15}/><span>{contact.email}</span></a>
          </div>
          <Link className="btn btn-primary btn-small" to="/contact">Enquire Now</Link>
          <button className="menu-btn" aria-label="Open menu"><Menu size={18} /></button>
          <span className="notification-bell" aria-label={adminToken ? `${notificationCount} new enquiries` : 'Notifications'} title={adminToken ? `${notificationCount} new enquiries` : 'Notifications'}><Bell size={21}/>{adminToken && notificationCount > 0 && <span>{notificationCount > 99 ? '99+' : notificationCount}</span>}</span>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-block">
              <div className="brand-inline">
                <span className="brand-mark">◎</span>
                <span>LIC AGENT</span>
              </div>
              <p>Professional assistance for health insurance, life insurance, and real estate solutions.</p>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Insurance Disclosure</li>
              </ul>
            </div>

            <div>
              <h4>Services</h4>
              <ul>
                <li>Real Estate RERA</li>
                <li>Contact Support</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 LIC Agent Services. Secure Your Family’s Future. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
