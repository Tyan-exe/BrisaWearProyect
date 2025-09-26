import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import productService from '../services/productService';
import useCartStore from '../store/useCartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const result = await productService.getProductById(id);
    if (result.success) {
      setProduct(result.product);
    } else {
      navigate('/tienda');
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      alert(`${quantity} ${product.name}(s) agregado(s) al carrito`);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h4>Producto no encontrado</h4>
          <button className="btn btn-primary" onClick={() => navigate('/tienda')}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageUrl || 'https://via.placeholder.com/500x400'];

  return (
    <div className="container py-4">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="me-2" />
        Volver
      </button>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <img
              src={images[selectedImage]}
              className="card-img-top"
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="d-flex gap-2 mt-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`img-thumbnail cursor-pointer ${
                    selectedImage === index ? 'border-primary' : ''
                  }`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <div className="mb-3">
            <span className="badge bg-secondary mb-2">{product.category}</span>
            <h1 className="h2">{product.name}</h1>
          </div>

          <div className="mb-4">
            <span className="h3 text-primary">${product.price?.toFixed(2)}</span>
          </div>

          <div className="mb-4">
            <h5>Descripción</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="mb-4">
            <div className="row">
              <div className="col-6">
                <strong>Stock disponible:</strong>
                <span className={`ms-2 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                  {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                </span>
              </div>
              <div className="col-6">
                <strong>SKU:</strong>
                <span className="ms-2 text-muted">{product.sku || product.id}</span>
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="mb-4">
              <label className="form-label">Cantidad</label>
              <div className="input-group" style={{ maxWidth: '150px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                  min="1"
                  max={product.stock}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          <div className="d-flex gap-3">
            <button
              className="btn btn-primary btn-lg flex-fill"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart className="me-2" />
              {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
          </div>

          <div className="mt-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Información adicional</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Envío gratis</small>
                    <p className="mb-2">En compras mayores a $50</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Garantía</small>
                    <p className="mb-2">30 días de garantía</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
