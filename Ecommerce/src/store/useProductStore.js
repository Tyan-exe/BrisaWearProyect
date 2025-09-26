import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: 'all',
  searchTerm: '',
  isLoading: false,
  
  setProducts: (products) => {
    set({ products });
    get().filterProducts();
  },
  
  setCategories: (categories) => set({ categories }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterProducts();
  },
  
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    get().filterProducts();
  },
  
  filterProducts: () => {
    const { products, selectedCategory, searchTerm } = get();
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    set({ filteredProducts: filtered });
  },
  
  addProduct: (product) => {
    set(state => ({
      products: [...state.products, product]
    }));
    get().filterProducts();
  },
  
  updateProduct: (productId, updatedProduct) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === productId ? { ...product, ...updatedProduct } : product
      )
    }));
    get().filterProducts();
  },
  
  deleteProduct: (productId) => {
    set(state => ({
      products: state.products.filter(product => product.id !== productId)
    }));
    get().filterProducts();
  }
}));

export default useProductStore;
