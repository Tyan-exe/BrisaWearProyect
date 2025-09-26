import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiMapPin, 
  FiPhone, 
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiTag,
  FiClock
} from 'react-icons/fi';
import orderService from '../services/orderService';
import useAuthStore from '../store/useAuthStore';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && orderId) {
      loadOrderDetail();
    }
  }, [user, orderId]);

  const loadOrderDetail = async () => {
    setLoading(true);
    try {
      const result = await orderService.getOrderById(orderId);
      if (result.success) {
        if (result.order.userId === user.uid) {
          setOrder(result.order);
        } else {
          navigate('/mis-pedidos');
        }
      } else {
        console.error('Error loading order:', result.error);
        navigate('/mis-pedidos');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      navigate('/mis-pedidos');
    }
    setLoading(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Pedido Recibido', icon: FiPackage },
      { key: 'confirmed', label: 'Confirmado', icon: FiCheckCircle },
      { key: 'processing', label: 'Preparando', icon: FiClock },
      { key: 'shipped', label: 'Enviado', icon: FiTruck },
      { key: 'delivered', label: 'Entregado', icon: FiCheckCircle }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h2>Acceso Requerido</h2>
            <p className="text-muted mb-4">Debes iniciar sesión para ver los detalles del pedido.</p>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando pedido...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Pedido no encontrado</h2>
          <p className="text-muted mb-4">El pedido que buscas no existe o no tienes permisos para verlo.</p>
          <Link to="/mis-pedidos" className="btn btn-primary">
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = order.appliedCoupon ? subtotal * (order.appliedCoupon.discount / 100) : 0;
  const total = subtotal - discount;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Link 
              to="/mis-pedidos" 
              className="btn btn-outline-primary me-3 hover-lift"
            >
              <FiArrowLeft className="me-1" />
              Volver
            </Link>
            <div>
              <h1 className="h2 fw-bold mb-1">
                Pedido #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-muted mb-0">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-custom mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0 fw-bold">Estado del Pedido</h5>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    {getStatusSteps().map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={step.key} className="col">
                          <div className="text-center">
                            <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                              step.completed ? 'bg-primary text-white' : 
                              step.active ? 'bg-warning text-dark' : 'bg-light text-muted'
                            }`} style={{width: '50px', height: '50px'}}>
                              <IconComponent size={20} />
                            </div>
                            <div className={`small fw-medium ${
                              step.completed ? 'text-primary' : 
                              step.active ? 'text-warning' : 'text-muted'
                            }`}>
                              {step.label}
                            </div>
                            {index < getStatusSteps().length - 1 && (
                              <div className={`progress mt-2 ${step.completed ? 'bg-primary' : 'bg-light'}`} 
                                   style={{height: '2px'}}>
                                <div className={`progress-bar ${step.completed ? 'bg-primary' : ''}`} 
                                     style={{width: step.completed ? '100%' : '0%'}}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mt-3">
                    <span className={`badge bg-${orderService.getOrderStatusColor(order.status)} px-3 py-2 rounded-pill`}>
                      {orderService.getOrderStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card border-0 shadow-custom">
                <div className="card-header bg-light">
                  <h5 className="mb-0 fw-bold">Productos Pedidos</h5>
                </div>
                <div className="card-body p-0">
                  {order.items.map((item, index) => (
                    <div key={index} className="border-bottom p-4">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img 
                            src={item.imageUrl || `https://picsum.photos/100/100?random=${index}`}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                          />
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-bold mb-1">{item.name}</h6>
                          <p className="text-muted small mb-2">{item.category}</p>
                          <span className="badge bg-light text-dark rounded-pill">
                            Cantidad: {item.quantity}
                          </span>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <div className="fw-bold">${item.price.toFixed(2)} c/u</div>
                          <div className="text-primary fw-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-custom mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0 fw-bold">Resumen del Pedido</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {order.appliedCoupon && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>
                        <FiTag className="me-1" />
                        Descuento ({order.appliedCoupon.code}):
                      </span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span className="text-success">Gratis</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold h5">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-custom">
                <div className="card-header bg-light">
                  <h5 className="mb-0 fw-bold">Información de Entrega</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FiMapPin className="me-2 text-muted" />
                      <strong>Dirección:</strong>
                    </div>
                    <p className="mb-0 ms-4 text-muted">
                      {order.customerInfo?.address || 'No especificada'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FiPhone className="me-2 text-muted" />
                      <strong>Teléfono:</strong>
                    </div>
                    <p className="mb-0 ms-4 text-muted">
                      {order.customerInfo?.phone || 'No especificado'}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FiMail className="me-2 text-muted" />
                      <strong>Email:</strong>
                    </div>
                    <p className="mb-0 ms-4 text-muted">
                      {order.customerInfo?.email || user.email}
                    </p>
                  </div>

                  {order.customerInfo?.notes && (
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <FiPackage className="me-2 text-muted" />
                        <strong>Notas:</strong>
                      </div>
                      <p className="mb-0 ms-4 text-muted">
                        {order.customerInfo.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 text-center">
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                {order.status === 'delivered' && (
                  <button className="btn btn-primary hover-lift">
                    <FiPackage className="me-2" />
                    Reordenar
                  </button>
                )}
                {['pending', 'confirmed'].includes(order.status) && (
                  <button className="btn btn-outline-danger hover-lift">
                    Cancelar Pedido
                  </button>
                )}
                <button className="btn btn-outline-primary hover-lift">
                  Descargar Factura
                </button>
                <Link to="/contacto" className="btn btn-outline-secondary hover-lift">
                  Contactar Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
