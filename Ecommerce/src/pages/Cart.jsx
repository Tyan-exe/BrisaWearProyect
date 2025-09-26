import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import orderService from '../services/orderService';

const Cart = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartStore();
  
  const { isAuthenticated, user } = useAuthStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const handleApplyCoupon = () => {
    const coupons = {
      'DESCUENTO10': 10,
      'BIENVENIDO': 15,
      'VERANO2024': 20
    };

    if (coupons[couponCode.toUpperCase()]) {
      const discount = coupons[couponCode.toUpperCase()];
      setAppliedCoupon({ code: couponCode, discount });
      setCouponCode('');
    } else {
      alert('Cupón no válido');
    }
  };

  const calculateFinalPrice = () => {
    let finalPrice = totalPrice;
    if (appliedCoupon) {
      finalPrice = totalPrice * (1 - appliedCoupon.discount / 100);
    }
    return finalPrice;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para realizar la compra');
      return;
    }
    setShowCheckout(true);
  };

  const handleWhatsAppOrder = async () => {
    const orderData = {
      userId: user.uid,
      items,
      totalPrice: calculateFinalPrice(),
      customerInfo,
      appliedCoupon,
      createdAt: new Date().toISOString()
    };

    const result = await orderService.createOrder(orderData);
    
    if (result.success) {
      orderService.sendWhatsAppOrder({
        ...orderData,
        orderId: result.orderId
      });
      
      clearCart();
      setShowCheckout(false);
      alert('¡Pedido enviado por WhatsApp! Te contactaremos pronto.');
    } else {
      alert('Error al crear el pedido');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FiShoppingBag size={64} className="text-muted mb-4" />
          <h3>Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            Agrega algunos productos para comenzar tu compra
          </p>
          <Link to="/tienda" className="btn btn-primary">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Finalizar Compra</h2>
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Información de Entrega</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Dirección de entrega</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Descuento ({appliedCoupon.code}):</span>
                    <span>-${(totalPrice * appliedCoupon.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>${calculateFinalPrice().toFixed(2)}</strong>
                </div>
                
                <button 
                  className="btn btn-success w-100 mb-2"
                  onClick={handleWhatsAppOrder}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                >
                  Enviar Pedido por WhatsApp
                </button>
                
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowCheckout(false)}
                >
                  Volver al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Carrito de Compras</h2>
      
      <div className="row">
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/100x100'}
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="text-muted small">{item.category}</p>
                  </div>
                  <div className="col-md-2">
                    <span className="fw-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        min="1"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Resumen</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Productos ({totalItems}):</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento ({appliedCoupon.code}):</span>
                  <span>-${(totalPrice * appliedCoupon.discount / 100).toFixed(2)}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${calculateFinalPrice().toFixed(2)}</strong>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Cupón de descuento</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Código del cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Aplicar
                  </button>
                </div>
                <small className="text-muted">
                  Prueba: DESCUENTO10, BIENVENIDO, VERANO2024
                </small>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-2"
                onClick={handleCheckout}
              >
                Proceder al Checkout
              </button>
              
              <button 
                className="btn btn-outline-danger w-100"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
