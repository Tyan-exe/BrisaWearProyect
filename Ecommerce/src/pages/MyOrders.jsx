import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiFilter,
  FiSearch,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import orderService from '../services/orderService';
import useAuthStore from '../store/useAuthStore';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus, searchTerm]);

  const loadUserOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      const result = await orderService.getUserOrders(user.uid);
      
      if (result.success) {
        setOrders(result.orders || []);
        setError(null);
      } else {
        setError('Error al cargar los pedidos: ' + result.error);
        setOrders([]);
      }
    } catch (error) {
      setError('Error inesperado al cargar los pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createSampleOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.createSampleOrders(user.uid);
      if (result.success) {
        await loadUserOrders();
      } else {
        setError('Error al crear pedidos de muestra: ' + result.error);
      }
    } catch (error) {
      setError('Error inesperado al crear pedidos de muestra');
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-warning" />;
      case 'confirmed':
      case 'processing':
        return <FiPackage className="text-info" />;
      case 'shipped':
        return <FiTruck className="text-primary" />;
      case 'delivered':
        return <FiCheckCircle className="text-success" />;
      case 'cancelled':
        return <FiXCircle className="text-danger" />;
      default:
        return <FiPackage className="text-secondary" />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'Formato de fecha desconocido';
      }
      
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Error en fecha';
    }
  };

  const calculateOrderTotal = (order) => {
    if (order.total) return order.total;
    
    return order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h2>Acceso Requerido</h2>
            <p className="text-muted mb-4">Debes iniciar sesión para ver tus pedidos.</p>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-2">Mis Pedidos</h1>
              <p className="text-muted mb-0">
                Gestiona y revisa el estado de tus compras
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-custom mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text border-0 bg-light">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      placeholder="Buscar por ID de pedido o producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text border-0 bg-light">
                      <FiFilter />
                    </span>
                    <select
                      className="form-select border-0 bg-light"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              <div className="d-flex align-items-center">
                <FiXCircle className="me-2" />
                <div>
                  <strong>Error:</strong> {error}
                  <button 
                    className="btn btn-link p-0 ms-2"
                    onClick={loadUserOrders}
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando pedidos...</span>
              </div>
              <p className="mt-3 text-muted">Cargando tus pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <FiPackage size={64} className="text-muted" />
              </div>
              <h3 className="h4 mb-3">
                {orders.length === 0 ? 'No tienes pedidos aún' : 'No se encontraron pedidos'}
              </h3>
              <p className="text-muted mb-4">
                {orders.length === 0 
                  ? 'Cuando realices tu primera compra, aparecerá aquí.'
                  : 'Intenta cambiar los filtros de búsqueda.'
                }
              </p>
              {orders.length === 0 && (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/tienda" className="btn btn-primary">
                    Explorar Productos
                  </Link>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={createSampleOrders}
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Ver Pedidos Demo'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="col-12">
                  <div className="card border-0 shadow-custom hover-lift">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-lg-8">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h5 className="mb-1 fw-bold">
                                Pedido #{order.id.slice(-8).toUpperCase()}
                              </h5>
                              <div className="d-flex align-items-center gap-3 text-muted small">
                                <span className="d-flex align-items-center">
                                  <FiCalendar className="me-1" />
                                  {formatDate(order.createdAt)}
                                </span>
                                <span className="d-flex align-items-center">
                                  <FiPackage className="me-1" />
                                  {order.items?.length || 0} productos
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex flex-wrap gap-2">
                              {order.items?.slice(0, 3).map((item, index) => (
                                <span key={index} className="badge bg-light text-dark rounded-pill px-3 py-2">
                                  {item.name} x{item.quantity}
                                </span>
                              ))}
                              {order.items?.length > 3 && (
                                <span className="badge bg-secondary rounded-pill px-3 py-2">
                                  +{order.items.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>

                          <span className={`badge bg-${orderService.getOrderStatusColor(order.status)} rounded-pill px-3 py-2`}>
                            {orderService.getOrderStatusText(order.status)}
                          </span>
                        </div>

                        <div className="col-lg-4 text-lg-end">
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-lg-end">
                              <FiDollarSign className="me-1 text-muted" />
                              <span className="h4 fw-bold mb-0">
                                ${calculateOrderTotal(order).toFixed(2)}
                              </span>
                            </div>
                            {order.appliedCoupon && (
                              <small className="text-success">
                                Descuento aplicado: {order.appliedCoupon.code}
                              </small>
                            )}
                          </div>

                          <div className="d-flex gap-2 justify-content-lg-end">
                            <Link
                              to={`/pedido/${order.id}`}
                              className="btn btn-outline-primary btn-sm hover-lift"
                            >
                              <FiEye className="me-1" />
                              Ver Detalles
                            </Link>
                            {order.status === 'delivered' && (
                              <button className="btn btn-primary btn-sm hover-lift">
                                Reordenar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <div className="row g-4 mt-4">
              <div className="col-md-3">
                <div className="card border-0 bg-light text-center p-3">
                  <h4 className="fw-bold text-primary mb-1">{orders.length}</h4>
                  <small className="text-muted">Total Pedidos</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light text-center p-3">
                  <h4 className="fw-bold text-success mb-1">
                    {orders.filter(o => o.status === 'delivered').length}
                  </h4>
                  <small className="text-muted">Entregados</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light text-center p-3">
                  <h4 className="fw-bold text-warning mb-1">
                    {orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
                  </h4>
                  <small className="text-muted">En Proceso</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light text-center p-3">
                  <h4 className="fw-bold text-primary mb-1">
                    ${orders.reduce((total, order) => total + calculateOrderTotal(order), 0).toFixed(2)}
                  </h4>
                  <small className="text-muted">Total Gastado</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
