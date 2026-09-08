import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  UserRound,
  Edit3,
  Trash2,
  X,
  Save,
  Building2,
  Users,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertTriangle,
} from 'lucide-react';
import '../css/Suppliers.css';

const Suppliers = () => {
  const { user } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
  });

  const [error, setError] = useState('');

  const canManage =
    user?.role === 'admin' ||
    user?.role === 'manager';

  const fetchSuppliers = () => {
    setLoading(true);

    api
      .get('/suppliers')
      .then((r) => setSuppliers(r.data.suppliers))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openCreate = () => {
    setEditing(null);

    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
    });

    setError('');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);

    setForm({
      name: s.name,
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
      contactPerson: s.contactPerson || '',
    });

    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editing) {
        await api.put(
          `/suppliers/${editing._id}`,
          form
        );
      } else {
        await api.post('/suppliers', form);
      }

      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) {
      return;
    }

    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Delete failed'
      );
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const query = search.toLowerCase();

    return (
      s.name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.phone?.toLowerCase().includes(query) ||
      s.contactPerson?.toLowerCase().includes(query) ||
      s.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="suppliers-page">

      {/* ================= HEADER ================= */}

      <div className="suppliers-header">

        <div className="suppliers-title-section">

          <div className="suppliers-title-icon">
            <Truck size={25} />
          </div>

          <div>
            <h1>Suppliers</h1>

            <p>
              Manage supplier information and business contacts
            </p>
          </div>

        </div>

        {canManage && (
          <button
            className="supplier-add-btn"
            onClick={openCreate}
          >
            <Plus size={19} />
            <span>Add Supplier</span>
          </button>
        )}

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="suppliers-summary">

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon blue">
            <Truck size={21} />
          </div>

          <div>
            <span>Total Suppliers</span>
            <strong>{suppliers.length}</strong>
          </div>

        </div>

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active Records</span>
            <strong>{suppliers.length}</strong>
          </div>

        </div>

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon purple">
            <Users size={21} />
          </div>

          <div>
            <span>Contact Persons</span>
            <strong>
              {
                suppliers.filter(
                  (s) => s.contactPerson
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon orange">
            <Building2 size={21} />
          </div>

          <div>
            <span>Businesses</span>
            <strong>{suppliers.length}</strong>
          </div>

        </div>

      </div>

      {/* ================= FILTER ================= */}

      <div className="suppliers-filter-card">

        <div className="supplier-filter-title">
          <Search size={17} />
          <span>Search Suppliers</span>
        </div>

        <div className="supplier-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, phone or contact..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
            >
              <X size={16} />
            </button>
          )}

        </div>

        <button
          className="supplier-refresh"
          onClick={fetchSuppliers}
          title="Refresh suppliers"
        >
          <RefreshCw
            size={18}
            className={
              loading ? 'supplier-spinning' : ''
            }
          />
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="suppliers-table-card">

        <div className="supplier-table-top">

          <div>
            <h3>Supplier Directory</h3>

            <p>
              {filteredSuppliers.length} supplier
              {filteredSuppliers.length !== 1
                ? 's'
                : ''}{' '}
              displayed
            </p>
          </div>

          <div className="supplier-live">

            <span></span>

            Supplier Network

          </div>

        </div>

        {loading ? (

          <div className="suppliers-loading">

            <div className="supplier-loader"></div>

            <p>Loading suppliers...</p>

          </div>

        ) : filteredSuppliers.length === 0 ? (

          <div className="suppliers-empty">

            <div className="supplier-empty-icon">
              <Truck size={35} />
            </div>

            <h3>
              {search
                ? 'No Suppliers Found'
                : 'No Suppliers Yet'}
            </h3>

            <p>
              {search
                ? 'Try a different search term.'
                : 'Add your first supplier to get started.'}
            </p>

            {canManage && !search && (
              <button
                className="supplier-add-btn"
                onClick={openCreate}
              >
                <Plus size={18} />
                Add Supplier
              </button>
            )}

          </div>

        ) : (

          <div className="supplier-table-wrapper">

            <table className="premium-supplier-table">

              <thead>

                <tr>
                  <th>SUPPLIER</th>
                  <th>CONTACT PERSON</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ADDRESS</th>
                  {canManage && (
                    <th>ACTIONS</th>
                  )}
                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map((s) => (

                  <tr key={s._id}>

                    {/* Supplier */}

                    <td>

                      <div className="supplier-name-cell">

                        <div className="supplier-avatar">
                          <Building2 size={18} />
                        </div>

                        <div>
                          <strong>
                            {s.name}
                          </strong>

                          <small>
                            Supplier
                          </small>
                        </div>

                      </div>

                    </td>

                    {/* Contact */}

                    <td>

                      {s.contactPerson ? (

                        <div className="supplier-contact-cell">

                          <div className="contact-avatar">
                            <UserRound size={14} />
                          </div>

                          <span>
                            {s.contactPerson}
                          </span>

                        </div>

                      ) : (
                        <span className="empty-value">
                          —
                        </span>
                      )}

                    </td>

                    {/* Email */}

                    <td>

                      {s.email ? (

                        <a
                          href={`mailto:${s.email}`}
                          className="supplier-info-link"
                        >
                          <Mail size={14} />
                          {s.email}
                        </a>

                      ) : (
                        <span className="empty-value">
                          —
                        </span>
                      )}

                    </td>

                    {/* Phone */}

                    <td>

                      {s.phone ? (

                        <a
                          href={`tel:${s.phone}`}
                          className="supplier-info-link phone"
                        >
                          <Phone size={14} />
                          {s.phone}
                        </a>

                      ) : (
                        <span className="empty-value">
                          —
                        </span>
                      )}

                    </td>

                    {/* Address */}

                    <td>

                      {s.address ? (

                        <div className="supplier-address">

                          <MapPin size={14} />

                          <span>
                            {s.address}
                          </span>

                        </div>

                      ) : (
                        <span className="empty-value">
                          —
                        </span>
                      )}

                    </td>

                    {/* Actions */}

                    {canManage && (

                      <td>

                        <div className="supplier-actions">

                          <button
                            className="supplier-action edit"
                            title="Edit Supplier"
                            onClick={() =>
                              openEdit(s)
                            }
                          >
                            <Edit3 size={16} />
                          </button>

                          {user?.role === 'admin' && (
                            <button
                              className="supplier-action delete"
                              title="Delete Supplier"
                              onClick={() =>
                                handleDelete(s._id)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= SUPPLIER MODAL ================= */}

      {showModal && (

        <div
          className="supplier-modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="supplier-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="supplier-modal-header">

              <div className="supplier-modal-heading">

                <div className="supplier-modal-icon">
                  {editing ? (
                    <Edit3 size={21} />
                  ) : (
                    <Truck size={21} />
                  )}
                </div>

                <div>

                  <h3>
                    {editing
                      ? 'Edit Supplier'
                      : 'Add Supplier'}
                  </h3>

                  <p>
                    {editing
                      ? 'Update supplier information'
                      : 'Create a new supplier record'}
                  </p>

                </div>

              </div>

              <button
                className="supplier-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            {error && (

              <div className="supplier-error">

                <AlertTriangle size={17} />

                {error}

              </div>

            )}

            <form
              onSubmit={handleSubmit}
              className="supplier-form"
            >

              {/* Basic */}

              <div className="supplier-section-title">

                <Building2 size={17} />

                Business Information

              </div>

              <div className="supplier-form-group">

                <label>
                  Supplier Name *
                </label>

                <input
                  className="supplier-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter supplier/business name"
                  required
                />

              </div>

              <div className="supplier-form-row">

                <div className="supplier-form-group">

                  <label>
                    Contact Person
                  </label>

                  <div className="supplier-input-wrapper">

                    <UserRound size={16} />

                    <input
                      className="supplier-input with-icon"
                      value={form.contactPerson}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          contactPerson:
                            e.target.value,
                        })
                      }
                      placeholder="Contact person name"
                    />

                  </div>

                </div>

                <div className="supplier-form-group">

                  <label>
                    Phone
                  </label>

                  <div className="supplier-input-wrapper">

                    <Phone size={16} />

                    <input
                      className="supplier-input with-icon"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone:
                            e.target.value,
                        })
                      }
                      placeholder="+92 XXX XXXXXXX"
                    />

                  </div>

                </div>

              </div>

              {/* Contact */}

              <div className="supplier-section-title">

                <Mail size={17} />

                Contact Information

              </div>

              <div className="supplier-form-group">

                <label>
                  Email Address
                </label>

                <div className="supplier-input-wrapper">

                  <Mail size={16} />

                  <input
                    type="email"
                    className="supplier-input with-icon"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email:
                          e.target.value,
                      })
                    }
                    placeholder="supplier@example.com"
                  />

                </div>

              </div>

              <div className="supplier-form-group">

                <label>
                  Address
                </label>

                <div className="supplier-input-wrapper textarea-icon">

                  <MapPin size={16} />

                  <textarea
                    className="supplier-input supplier-textarea with-icon"
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address:
                          e.target.value,
                      })
                    }
                    placeholder="Enter supplier address..."
                  />

                </div>

              </div>

              {/* Footer */}

              <div className="supplier-modal-footer">

                <button
                  type="button"
                  className="supplier-cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="supplier-submit-btn"
                >

                  <Save size={17} />

                  {editing
                    ? 'Update Supplier'
                    : 'Create Supplier'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Suppliers;