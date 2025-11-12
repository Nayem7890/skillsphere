import React from 'react';
import { NavLink, Outlet, useLocation, Link } from "react-router";
import { useAuth } from "../Providers/AuthProvider";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/dashboard/add-course", label: "Add Course", icon: "➕" },
    { path: "/dashboard/my-courses", label: "My Courses", icon: "📚" },
    { path: "/dashboard/my-enrolled", label: "My Enrolled", icon: "🎓" },
  ];

  const sectionTitle =
    menuItems.find((m) => m.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Main content */}
        <div className="drawer-content flex flex-col min-h-screen">
          {/* Mobile top bar */}
          <div className="navbar bg-base-200 lg:hidden sticky top-0 z-20">
            <div className="flex-none">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-square btn-ghost"
                aria-label="Open dashboard menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-xl font-bold">
                SkillSphere
              </Link>
            </div>
          </div>

          {/* Page header */}
          <div className="px-4 md:px-6 pt-4">
            <div className="breadcrumbs text-sm opacity-70">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li>Dashboard</li>
                {sectionTitle !== "Dashboard" && <li>{sectionTitle}</li>}
              </ul>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{sectionTitle}</h1>
          </div>

          {/* Routed page content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay" />
          <aside className="w-72 min-h-full bg-base-200 border-r border-base-300 sticky top-0">
            {/* Brand */}
            <div className="p-4 border-b border-base-300">
              <Link to="/" className="btn btn-ghost text-xl font-bold w-full justify-start">
                SkillSphere
              </Link>
            </div>

            {/* Menu */}
            <nav className="p-4">
              <ul className="menu gap-1" role="menu" aria-label="Dashboard navigation">
                {menuItems.map((item) => (
                  <li key={item.path} role="none">
                    <NavLink
                      to={item.path}
                      role="menuitem"
                      className={({ isActive }) =>
                        [
                          "justify-start",
                          isActive ? "active bg-primary/10 text-primary font-semibold" : "",
                        ].join(" ")
                      }
                      end
                    >
                      <span className="text-xl mr-2">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User card */}
            <div className="p-4 mt-auto border-t border-base-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.photoURL || "https://i.ibb.co/5GzXgmq/avatar.png"}
                      alt={user?.displayName || "User"}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{user?.displayName || "User"}</p>
                  <p className="text-xs text-base-content/70 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to="/" className="btn btn-outline btn-sm flex-1">
                  Home
                </Link>
                {logout && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={logout}
                    type="button"
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
