import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import useAuthStore from '../store/useAuthStore';

class AuthService {
  constructor() {
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      const { setUser, setLoading } = useAuthStore.getState();
      setLoading(true);
      
      if (user) {
        const userDoc = await this.getUserData(user.uid);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userDoc
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      await this.saveUserData(user.uid, {
        email: user.email,
        displayName: userData.displayName || '',
        role: userData.role || 'customer',
        createdAt: new Date().toISOString(),
        ...userData
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      const { logout } = useAuthStore.getState();
      logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async saveUserData(uid, userData) {
    try {
      await setDoc(doc(db, 'users', uid), userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  isAuthenticated() {
    return !!auth.currentUser;
  }
}

export default new AuthService();
