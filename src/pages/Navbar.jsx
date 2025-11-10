// src/Pages/Navbar.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { NavLink, Link, useNavigate } from "react-router";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto flex items-center">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold">
            SkillSphere
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2 items-center">
            <li>
              <NavLink to="/" end className="btn btn-ghost">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses" className="btn btn-ghost">
                Courses
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink to="/dashboard/my-courses" className="btn btn-ghost">
                  Dashboard
                </NavLink>
              </li>
            )}

            <li>
              <button onClick={toggleTheme} className="btn btn-ghost" aria-label="Toggle theme">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </li>

            {loading ? (
              <li>
                <span className="loading loading-spinner loading-sm" />
              </li>
            ) : user ? (
              <li className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User"
                      src={user.photoURL || "https://i.ibb.co/5GzXgmq/avatar.png"}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <span className="justify-between">{user.displayName || "User"}</span>
                  </li>
                  <li>
                    <span className="truncate">{user.email}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </li>
            ) : (
              // ✅ Logged-out state: show ONLY Register button
              <li>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
