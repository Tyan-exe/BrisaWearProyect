import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { sampleProducts, sampleCategories } from '../data/sampleData';

class ProductService {
  constructor() {
    this.collectionName = 'products';
  }

  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.collectionName), orderBy('createdAt', 'desc'))
      );
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      
      if (products.length === 0) {
        return { success: true, products: sampleProducts };
      }
      
      return { success: true, products };
    } catch (error) {
      return { success: true, products: sampleProducts };
    }
  }

  async getProductById(productId) {
    try {
      const docRef = doc(db, this.collectionName, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, product: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Product not found' };
      }
    } catch (error) {
      const product = sampleProducts.find(p => p.id === productId);
      if (product) {
        return { success: true, product };
      }
      return { success: false, error: 'Product not found' };
    }
  }

  async getProductsByCategory(category) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, productId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProduct(productId, productData) {
    try {
      const docRef = doc(db, this.collectionName, productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, this.collectionName, productId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const categories = new Set();
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        if (product.category) {
          categories.add(product.category);
        }
      });
      
      if (categories.size === 0) {
        return { success: true, categories: sampleCategories };
      }
      
      return { success: true, categories: Array.from(categories) };
    } catch (error) {
      return { success: true, categories: sampleCategories };
    }
  }

  async searchProducts(searchTerm) {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const products = [];
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        if (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          products.push(product);
        }
      });
      return { success: true, products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ProductService();
