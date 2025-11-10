import React from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      {/* Top */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight">SkillSphere</span>
            </Link>
            <p className="mt-3 opacity-80">
              Learn practical skills with curated courses, expert instructors, and a smooth,
              responsive experience—any device, any time.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="badge badge-primary">Secure Auth</span>
              <span className="badge">Responsive</span>
              <span className="badge">Dark/Light</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="link link-hover">Home</Link></li>
              <li><Link to="/courses" className="link link-hover">All Courses</Link></li>
              {/* If you want auth-aware links, inject context and conditionally render */}
              <li><Link to="/register" className="link link-hover">Register</Link></li>
              <li><Link to="/login" className="link link-hover">Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-title text-lg font-semibold">Legal</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/terms" className="link link-hover">Terms of Use</Link></li>
              <li><Link to="/privacy" className="link link-hover">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="link link-hover">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="footer-title text-lg font-semibold">Stay in the loop</h4>
            <form
              className="mt-2 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const email = new FormData(e.currentTarget).get("email");
                if (!email) return;
                // Plug SweetAlert/react-hot-toast here
                // toast.success('Subscribed!');
                e.currentTarget.reset();
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="input input-bordered flex-1"
                aria-label="Email address"
              />
              <button className="btn btn-primary">Subscribe</button>
            </form>

            <div className="mt-4 space-y-1 text-sm opacity-80">
              <p>Contact: support@skillsphere.dev</p>
              <p>Dhaka, Bangladesh</p>
            </div>

            <div className="mt-4 flex gap-4">
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="btn btn-ghost btn-sm"
                title="Follow on X"
              >
                <BsTwitterX />
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="btn btn-ghost btn-sm"
                title="Subscribe on YouTube"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 15.999v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="btn btn-ghost btn-sm"
                title="Follow on Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-10 flex justify-end">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑ Back to top
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-base-300">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-3 justify-between">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} SkillSphere. All rights reserved.
          </p>
          <div className="text-sm flex gap-4 opacity-80">
            <Link to="/accessibility" className="link link-hover">Accessibility</Link>
            <Link to="/sitemap" className="link link-hover">Sitemap</Link>
            <Link to="/status" className="link link-hover">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;