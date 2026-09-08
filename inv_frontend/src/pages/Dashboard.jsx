import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Package,
  Tags,
  Truck,
  AlertTriangle,
  Boxes,
  Wallet,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import '../css/Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-empty">
        <AlertTriangle size={42} />
        <h3>Unable to load dashboard</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts ?? 0,
      icon: Package,
      className: 'primary',
    },
    {
      label: 'Categories',
      value: stats.totalCategories ?? 0,
      icon: Tags,
      className: 'success',
    },
    {
      label: 'Suppliers',
      value: stats.totalSuppliers ?? 0,
      icon: Truck,
      className: 'purple',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount ?? 0,
      icon: AlertTriangle,
      className: stats.lowStockCount > 0 ? 'warning' : 'success',
    },
    {
      label: 'Total Stock Qty',
      value: stats.totalStock ?? 0,
      icon: Boxes,
      className: 'info',
    },
    {
      label: 'Inventory Value',
      value: `Rs ${(stats.inventoryValue ?? 0).toLocaleString()}`,
      icon: Wallet,
      className: 'primary',
    },
  ];

  return (
    <div className="premium-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title-row">
            <div className="dashboard-title-icon">
              <Activity size={22} />
            </div>

            <div>
              <h2>Dashboard</h2>
              <p>Overview of your inventory and stock performance</p>
            </div>
          </div>
        </div>

        <div className="dashboard-status">
          <span className="status-dot"></span>
          System Active
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid premium-stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className={`stat-card premium-stat-card ${stat.className}`}
              key={stat.label}
            >
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <div className="stat-arrow">
                  <ArrowUpRight size={17} />
                </div>
              </div>

              <div className="stat-content">
                <div className="label">{stat.label}</div>
                <div className="value">{stat.value}</div>
              </div>

              <div className="stat-glow"></div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="dashboard-main-grid">

        {/* Low Stock */}
        <div className="card premium-panel">

          <div className="panel-header">
            <div className="panel-heading">
              <div className="panel-icon warning-icon">
                <AlertTriangle size={19} />
              </div>

              <div>
                <h3>Low Stock Alerts</h3>
                <p>Products that need attention</p>
              </div>
            </div>

            {stats.lowStockCount > 0 && (
              <span className="alert-count">
                {stats.lowStockCount} Alert
                {stats.lowStockCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {stats.lowStockProducts?.length === 0 ? (
            <div className="premium-empty">
              <div className="empty-icon success-empty">
                ✓
              </div>
              <h4>Stock Levels Look Good</h4>
              <p>All products currently have sufficient stock.</p>
            </div>
          ) : (
            <div className="table-container premium-table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Threshold</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.lowStockProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="product-name-cell">
                          <div className="product-mini-icon">
                            <Package size={16} />
                          </div>

                          <span>{p.name}</span>
                        </div>
                      </td>

                      <td>
                        <span className="sku-text">
                          {p.sku}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-danger premium-badge">
                          {p.quantity}
                        </span>
                      </td>

                      <td>
                        <span className="threshold-value">
                          {p.lowStockThreshold}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="card premium-panel">

          <div className="panel-header">
            <div className="panel-heading">
              <div className="panel-icon product-icon">
                <Package size={19} />
              </div>

              <div>
                <h3>Recent Products</h3>
                <p>Latest additions to inventory</p>
              </div>
            </div>

            <span className="recent-badge">
              Latest
            </span>
          </div>

          {stats.recentProducts?.length === 0 ? (
            <div className="premium-empty">
              <div className="empty-icon">
                <Package size={24} />
              </div>
              <h4>No Products Yet</h4>
              <p>Your recently added products will appear here.</p>
            </div>
          ) : (
            <>
              <div className="table-container premium-table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.recentProducts.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="product-name-cell">
                            <div className="product-mini-icon">
                              <Package size={16} />
                            </div>

                            <span>{p.name}</span>
                          </div>
                        </td>

                        <td>
                          <span className="category-pill">
                            {p.category?.name || '-'}
                          </span>
                        </td>

                        <td>
                          <strong>{p.quantity ?? 0}</strong>
                        </td>

                        <td>
                          <span className="price-text">
                            Rs {(p.price ?? 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="panel-footer">
                <Link
                  to="/products"
                  className="btn btn-outline btn-sm premium-view-btn"
                >
                  View All Products
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;