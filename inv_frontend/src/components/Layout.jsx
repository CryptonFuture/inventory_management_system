import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  LogOut,
  Boxes,
  ChevronRight,
} from 'lucide-react';

import '../css/Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
code 
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/products',
      label: 'Products',
      icon: Package,
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: Tags,
    },
    {
      to: '/suppliers',
      label: 'Suppliers',
      icon: Truck,
    },
  ];

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <Boxes size={24} />
          </div>

          <div className="brand-content">
            <h1>Inventory</h1>
            <span>Management System</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-section-label">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="nav-icon">
                  <Icon size={19} strokeWidth={2} />
                </div>

                <span className="nav-label">
                  {item.label}
                </span>

                <ChevronRight
                  className="nav-arrow"
                  size={15}
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Area */}
        <div className="sidebar-bottom">

          {/* User Card */}
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : 'U'}
            </div>

            <div className="user-info">
              <strong>
                {user?.name || 'User'}
              </strong>

              <span>
                {user?.role || 'User'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;