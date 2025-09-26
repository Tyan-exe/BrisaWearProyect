import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import productService from '../services/productService';
import orderService from '../services/orderService';
import useProductStore from '../store/useProductStore';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await productService.getAllProducts();
    if (result.success) {
      setProducts(result.products);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    const result = await orderService.getAllOrders();
    if (result.success) {
      setOrders(result.orders);
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock)
    };

    let result;
    if (editingProduct) {
      result = await productService.updateProduct(editingProduct.id, productData);
    } else {
      result = await productService.addProduct(productData);
    }

    if (result.success) {
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: ''
      });
      loadProducts();
    } else {
      alert('Error al guardar el producto');
    }
    setLoading(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        loadProducts();
      } else {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    const result = await orderService.updateOrderStatus(orderId, status);
    if (result.success) {
      loadOrders();
    } else {
      alert('Error al actualizar el estado del pedido');
    }
  };

  const ProductModal = () => (
    <div className={`modal fade ${showProductModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={() => {
                setShowProductModal(false);
                setEditingProduct(null);
              }}
            ></button>
          </div>
          <form onSubmit={handleProductSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="url"
                    className="form-control"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel de Administración</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
        </li>
      </ul>

      {activeTab === 'products' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Gestión de Productos</h4>
            <button 
              className="btn btn-primary"
              onClick={() => setShowProductModal(true)}
            >
              <FiPlus className="me-2" />
              Agregar Producto
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/50x50'}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h4 className="mb-4">Gestión de Pedidos</h4>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {orders.map((order) => (
                <div key={order.id} className="col-lg-6 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Pedido #{order.id.substring(0, 8)}</h6>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Cliente:</strong> {order.customerInfo?.name}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {order.customerInfo?.email}
                      </div>
                      <div className="mb-2">
                        <strong>Teléfono:</strong> {order.customerInfo?.phone}
                      </div>
                      <div className="mb-2">
                        <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="mb-2">
                        <strong>Productos:</strong>
                        <ul className="list-unstyled ms-3">
                          {order.items?.map((item, index) => (
                            <li key={index}>
                              {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showProductModal && <ProductModal />}
    </div>
  );
};

export default Admin;
