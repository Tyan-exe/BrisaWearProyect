import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { createSampleOrdersForUser } from '../data/sampleOrders';

class OrderService {
  constructor() {
    this.collectionName = 'orders';
  }

  async createOrder(orderData) {
    try {
      const orderToSave = {
        userId: orderData.userId,
        items: orderData.items || [],
        totalPrice: orderData.totalPrice || 0,
        customerInfo: orderData.customerInfo || {},
        appliedCoupon: orderData.appliedCoupon || null,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, this.collectionName), orderToSave);
      return { success: true, orderId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrderById(orderId) {
    try {
      const docRef = doc(db, this.collectionName, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, order: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Order not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserOrders(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      let q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const processedOrder = {
          id: doc.id,
          ...orderData,
          createdAt: orderData.createdAt?.toDate ? orderData.createdAt.toDate() : orderData.createdAt,
          updatedAt: orderData.updatedAt?.toDate ? orderData.updatedAt.toDate() : orderData.updatedAt
        };
        orders.push(processedOrder);
      });
      
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      
      return { success: true, orders };
    } catch (error) {
      try {
        const allOrdersSnapshot = await getDocs(collection(db, this.collectionName));
        const userOrders = [];
        
        allOrdersSnapshot.forEach((doc) => {
          const orderData = doc.data();
          if (orderData.userId === userId) {
            userOrders.push({
              id: doc.id,
              ...orderData,
              createdAt: orderData.createdAt?.toDate ? orderData.createdAt.toDate() : orderData.createdAt,
              updatedAt: orderData.updatedAt?.toDate ? orderData.updatedAt.toDate() : orderData.updatedAt
            });
          }
        });
        
        userOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        
        return { success: true, orders: userOrders };
      } catch (fallbackError) {
        return { success: false, error: fallbackError.message };
      }
    }
  }

  async getOrdersByStatus(userId, status) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, orders };
    } catch (error) {
      console.error('Error getting orders by status:', error);
      return { success: false, error: error.message };
    }
  }

  getOrderStatusText(status) {
    const statusMap = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getOrderStatusColor(status) {
    const colorMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'shipped': 'success',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colorMap[status] || 'secondary';
  }


  async createSampleOrders(userId) {
    try {
      const existingOrders = await this.getUserOrders(userId);
      if (existingOrders.success && existingOrders.orders.length > 0) {
        return { success: true, message: 'User already has orders' };
      }

      const sampleOrders = createSampleOrdersForUser(userId);
      const createdOrders = [];

      for (const orderData of sampleOrders) {
        const result = await this.createOrder(orderData);
        if (result.success) {
          createdOrders.push(result.orderId);
        }
      }

      return { 
        success: true, 
        orders: createdOrders,
        message: `Created ${createdOrders.length} sample orders`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllOrders() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.collectionName), orderBy('createdAt', 'desc'))
      );
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  generateWhatsAppMessage(order) {
    const { customerInfo, items, totalPrice, orderId } = order;
    
    let message = ` *Nueva Orden - BrisaWear*\n\n`;
    message += ` *Orden ID:* ${orderId}\n`;
    message += `*Cliente:* ${customerInfo.name}\n`;
    message += ` *Email:* ${customerInfo.email}\n`;
    message += ` *Teléfono:* ${customerInfo.phone}\n`;
    message += ` *Dirección:* ${customerInfo.address}\n\n`;
    
    message += ` *Productos:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.price.toFixed(2)}\n`;
      message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `*Total: $${totalPrice.toFixed(2)}*\n\n`;
    message += `¡Gracias por tu compra! `;
    
    return encodeURIComponent(message);
  }

  sendWhatsAppOrder(order, phoneNumber = '1234567890') {
    const message = this.generateWhatsAppMessage(order);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}

export default new OrderService();
