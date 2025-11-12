// src/components/Navbar.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { NavLink, Link, useNavigate } from "react-router";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  // Close on escape
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    "btn btn-ghost " + (isActive ? "btn-active" : "");

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="navbar">
          {/* Left: Brand */}
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl font-extrabold">
              SkillSphere
            </Link>
          </div>

          {/* Right: Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            <NavLink to="/" end className={navItemClass}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navItemClass}>
              Courses
            </NavLink>

            {user && (
              <NavLink to="/dashboard/my-courses" className={navItemClass}>
                Dashboard
              </NavLink>
            )}

            <button
              onClick={toggleTheme}
              className="btn btn-ghost"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User"
                      src={user.photoURL || "https://i.ibb.co/5GzXgmq/avatar.png"}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
                >
                  <li className="px-2 py-1">
                    <div className="font-semibold truncate">
                      {user.displayName || "User"}
                    </div>
                    <div className="text-xs opacity-70 truncate">
                      {user.email}
                    </div>
                  </li>
                  <li className="mt-1">
                    <button onClick={handleLogout} className="justify-start">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <div className="lg:hidden">
            <button
              className="btn btn-square btn-ghost"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[64px] bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute left-0 right-0 z-50 bg-base-100 shadow-md border-t transition-[max-height,opacity] duration-200 overflow-hidden ${
          mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="menu p-4 space-y-2">
          <li>
            <NavLink
              to="/"
              end
              className="btn btn-ghost justify-start w-full"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className="btn btn-ghost justify-start w-full"
              onClick={() => setMobileOpen(false)}
            >
              Courses
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink
                to="/dashboard/my-courses"
                className="btn btn-ghost justify-start w-full"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
          )}

          <li className="pt-1">
            <button
              onClick={() => {
                toggleTheme();
                // keep menu open so user sees the change
              }}
              className="btn btn-ghost justify-start w-full"
              aria-label="Toggle theme"
            >
              <span className="mr-2">{theme === "light" ? "🌙" : "☀️"}</span>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </li>

          {loading ? (
            <li>
              <span className="loading loading-spinner loading-sm" />
            </li>
          ) : user ? (
            <>
              <li className="divider my-2" />
              <li>
                <div className="flex items-center gap-3 p-2">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User"
                        src={user.photoURL || "https://i.ibb.co/5GzXgmq/avatar.png"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-sm opacity-70 truncate max-w-[200px]">
                      {user.email}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-outline w-full justify-start"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/register"
                className="btn btn-primary w-full justify-start"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
