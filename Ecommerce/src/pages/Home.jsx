import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiTruck, FiShield, FiRotateCcw, FiStar, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import productService from '../services/productService';
import useCartStore from '../store/useCartStore';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    const result = await productService.getAllProducts();
    if (result.success) {
      setFeaturedProducts(result.products.slice(0, 6));
    }
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="row align-items-center min-vh-70">
            <div className="col-lg-6 slide-in-left">
              <div className="mb-4">
                <span className="badge bg-dark text-white px-4 py-2 rounded-pill mb-3 shadow-custom">
                  ✨ Colección Premium 2024
                </span>
              </div>
              <h1 className="display-2 fw-bold mb-4 text-dark">
                Estilo que
                <span className="d-block text-secondary">
                  Define tu Esencia
                </span>
              </h1>
              <p className="lead mb-5 text-muted fs-5">
                Descubre piezas únicas que combinan elegancia, comodidad y sostenibilidad. 
                Cada prenda cuenta una historia de calidad excepcional.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/tienda" className="btn btn-primary btn-lg px-5 py-3 hover-lift">
                  <FiShoppingCart className="me-2" />
                  Explorar Colección
                </Link>
                <Link to="/ofertas" className="btn btn-outline-primary btn-lg px-5 py-3 hover-lift">
                  <FiTrendingUp className="me-2" />
                  Ver Tendencias
                </Link>
              </div>
              <div className="d-flex align-items-center gap-4 text-muted">
                <div className="d-flex align-items-center">
                  <FiStar className="text-warning me-1" />
                  <small>4.9/5 valoración</small>
                </div>
                <div className="d-flex align-items-center">
                  <FiTruck className="me-1" />
                  <small>Envío gratis +$50</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center slide-in-right">
              <div className="position-relative">
                <div className="bg-light rounded-4 p-4 shadow-custom">
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=500&fit=crop&crop=center" 
                    alt="BrisaWear Fashion Collection" 
                    className="img-fluid rounded-3"
                    style={{maxHeight: '500px', objectFit: 'cover', width: '100%'}}
                  />
                </div>
                <div className="position-absolute top-0 end-0 m-4">
                  <span className="badge bg-danger text-white px-3 py-2 rounded-pill shadow">
                    Nuevo
                  </span>
                </div>
                <div className="position-absolute bottom-0 start-0 m-4">
                  <div className="bg-white rounded-3 p-3 shadow-custom">
                    <div className="d-flex align-items-center">
                      <div className="icon-circle me-3">
                        <FiShield size={24} />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Calidad Garantizada</h6>
                        <small className="text-muted">Materiales premium</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center fade-in-up">
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4">
                <h2 className="display-6 fw-bold text-dark mb-2">15K+</h2>
                <p className="text-muted mb-0 fw-medium">Clientes Satisfechos</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4">
                <h2 className="display-6 fw-bold text-dark mb-2">500+</h2>
                <p className="text-muted mb-0 fw-medium">Productos Únicos</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4">
                <h2 className="display-6 fw-bold text-dark mb-2">98%</h2>
                <p className="text-muted mb-0 fw-medium">Satisfacción</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4">
                <h2 className="display-6 fw-bold text-dark mb-2">24h</h2>
                <p className="text-muted mb-0 fw-medium">Envío Express</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 fade-in-up">
            <h2 className="display-5 fw-bold mb-3 text-dark">¿Por qué elegir BrisaWear?</h2>
            <p className="lead text-muted">Experiencia de compra excepcional con beneficios únicos</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 fade-in-up">
              <div className="card h-100 border-0 shadow-custom hover-lift text-center p-4">
                <div className="card-body">
                  <div className="icon-circle mx-auto mb-4">
                    <FiTruck size={28} />
                  </div>
                  <h5 className="card-title fw-bold mb-3">Envío Express</h5>
                  <p className="card-text text-muted">
                    Entrega gratuita en 24-48 horas para compras superiores a $50. 
                    Seguimiento en tiempo real incluido.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="card h-100 border-0 shadow-custom hover-lift text-center p-4">
                <div className="card-body">
                  <div className="icon-circle mx-auto mb-4">
                    <FiShield size={28} />
                  </div>
                  <h5 className="card-title fw-bold mb-3">Compra Protegida</h5>
                  <p className="card-text text-muted">
                    Tus datos están protegidos con encriptación SSL de nivel bancario. 
                    Pagos 100% seguros garantizados.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="card h-100 border-0 shadow-custom hover-lift text-center p-4">
                <div className="card-body">
                  <div className="icon-circle mx-auto mb-4">
                    <FiRotateCcw size={28} />
                  </div>
                  <h5 className="card-title fw-bold mb-3">Devoluciones Fáciles</h5>
                  <p className="card-text text-muted">
                    30 días para cambios y devoluciones sin preguntas. 
                    Proceso simple y reembolso inmediato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5 fade-in-up">
            <h2 className="display-5 fw-bold mb-3 text-dark">Productos Destacados</h2>
            <p className="lead text-muted">Descubre nuestras piezas más exclusivas y populares de la temporada</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="col-lg-4 col-md-6 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="card product-card h-100 border-0 shadow-custom">
                    <div className="position-relative overflow-hidden">
                      <img 
                        src={product.imageUrl || `https://picsum.photos/400/300?random=${product.id}`} 
                        className="card-img-top product-image" 
                        alt={product.name}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <button className="btn btn-light btn-sm rounded-circle p-2 shadow hover-lift">
                          <FiStar size={16} />
                        </button>
                      </div>
                      {index < 3 && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-dark text-white px-3 py-2 rounded-pill shadow">
                            <FiTrendingUp size={12} className="me-1" />
                            Trending
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <div className="mb-3">
                        <span className="badge bg-light text-dark rounded-pill px-3 py-1 border">
                          {product.category}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold mb-2 text-dark">{product.name}</h5>
                      <p className="card-text text-muted small mb-3 flex-grow-1">
                        {product.description?.substring(0, 85)}...
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="h4 text-dark fw-bold mb-0">
                              ${product.price?.toFixed(2)}
                            </span>
                          </div>
                          <small className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'} rounded-pill`}>
                            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                          </small>
                        </div>
                        <div className="d-grid gap-2">
                          <div className="btn-group">
                            <Link 
                              to={`/producto/${product.id}`}
                              className="btn btn-outline-primary hover-lift"
                            >
                              <FiEye className="me-1" />
                              Ver Detalles
                            </Link>
                            <button 
                              className="btn btn-primary hover-lift"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <FiShoppingCart className="me-1" />
                              {product.stock === 0 ? 'Agotado' : 'Agregar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-5 fade-in-up">
            <Link to="/tienda" className="btn btn-primary btn-lg px-5 py-3 hover-lift">
              <FiArrowRight className="me-2" />
              Ver Toda la Colección
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5" style={{background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--dark-gray) 100%)'}}>
        <div className="container">
          <div className="row justify-content-center text-center text-white fade-in-up">
            <div className="col-lg-8">
              <div className="mb-4">
                <div className="icon-circle mx-auto mb-4" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                  <FiStar size={32} className="text-white" />
                </div>
              </div>
              <h2 className="display-6 fw-bold mb-4">¡Únete a la Comunidad BrisaWear!</h2>
              <p className="lead mb-5 text-white-50">
                Sé el primero en conocer nuestras nuevas colecciones, ofertas exclusivas y tendencias de moda. 
                Recibe un <strong className="text-white">15% de descuento</strong> en tu primera compra.
              </p>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="input-group mb-4 shadow-lg">
                    <input 
                      type="email" 
                      className="form-control form-control-lg border-0" 
                      placeholder="Ingresa tu email aquí..."
                      style={{borderRadius: '50px 0 0 50px', padding: '15px 25px'}}
                    />
                    <button 
                      className="btn btn-light btn-lg px-4 fw-bold" 
                      type="button"
                      style={{borderRadius: '0 50px 50px 0', minWidth: '140px'}}
                    >
                      Suscribirse
                    </button>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-4 text-white-50 small">
                    <div className="d-flex align-items-center">
                      <FiShield className="me-1" />
                      <span>Sin spam</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FiRotateCcw className="me-1" />
                      <span>Cancela cuando quieras</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
