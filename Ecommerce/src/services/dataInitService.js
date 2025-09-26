import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { sampleProducts } from '../data/sampleData';

class DataInitService {
  async initializeSampleData() {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      
      if (productsSnapshot.empty) {
        for (const product of sampleProducts) {
          await setDoc(doc(db, 'products', product.id), product);
        }
        return { success: true, message: 'Sample data initialized' };
      } else {
        return { success: true, message: 'Data already exists' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createAdminUser() {
    try {
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new DataInitService();
