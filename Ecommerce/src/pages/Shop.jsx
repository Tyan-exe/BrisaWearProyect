import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiSearch } from 'react-icons/fi';
import productService from '../services/productService';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';

const Shop = () => {
  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchTerm,
    isLoading,
    setProducts,
    setCategories,
    setSelectedCategory,
    setSearchTerm,
    setLoading
  } = useProductStore();

  const { addItem } = useCartStore();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await productService.getAllProducts();
    if (result.success) {
      setProducts(result.products);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const result = await productService.getCategories();
    if (result.success) {
      setCategories(['all', ...result.categories]);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Filtros</h5>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-4">
                <label className="form-label">Buscar productos</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <span className="input-group-text">
                    <FiSearch />
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="form-label">Categorías</label>
                <div className="list-group list-group-flush">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`list-group-item list-group-item-action ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category === 'all' ? 'Todas las categorías' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Tienda</h2>
            <span className="text-muted">
              {filteredProducts.length} productos encontrados
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h4>No se encontraron productos</h4>
              <p className="text-muted">
                Intenta cambiar los filtros o términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted small">
                        {product.description?.substring(0, 100)}...
                      </p>
                      <div className="mb-2">
                        <span className="badge bg-secondary">
                          {product.category}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h5 text-primary mb-0">
                            ${product.price?.toFixed(2)}
                          </span>
                          <small className="text-muted">
                            Stock: {product.stock}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/producto/${product.id}`}
                            className="btn btn-outline-primary flex-fill"
                          >
                            <FiEye className="me-1" />
                            Ver
                          </Link>
                          <button
                            className="btn btn-primary flex-fill"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
