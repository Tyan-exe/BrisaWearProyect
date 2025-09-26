export const sampleOrders = [
  {
    id: 'order_001',
    userId: 'sample_user_id',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: 'Camiseta Básica Blanca',
        price: 25.99,
        quantity: 2,
        category: 'Camisetas',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
      },
      {
        id: '3',
        name: 'Vestido Floral Verano',
        price: 65.50,
        quantity: 1,
        category: 'Vestidos',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
      }
    ],
    customerInfo: {
      name: 'Usuario Demo',
      email: 'usuario@demo.com',
      phone: '+1234567890',
      address: 'Calle Principal 123, Ciudad, País',
      notes: 'Entregar en horario de oficina'
    },
    appliedCoupon: {
      code: 'BIENVENIDO',
      discount: 15
    },
    total: 97.47,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-18T14:20:00')
  },
  {
    id: 'order_002',
    userId: 'sample_user_id',
    status: 'shipped',
    items: [
      {
        id: '4',
        name: 'Chaqueta de Cuero Negro',
        price: 149.99,
        quantity: 1,
        category: 'Chaquetas',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'
      }
    ],
    customerInfo: {
      name: 'Usuario Demo',
      email: 'usuario@demo.com',
      phone: '+1234567890',
      address: 'Calle Principal 123, Ciudad, País'
    },
    total: 149.99,
    createdAt: new Date('2024-01-20T16:45:00'),
    updatedAt: new Date('2024-01-22T09:15:00')
  },
  {
    id: 'order_003',
    userId: 'sample_user_id',
    status: 'processing',
    items: [
      {
        id: '5',
        name: 'Zapatillas Deportivas',
        price: 89.99,
        quantity: 1,
        category: 'Calzado',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
      },
      {
        id: '8',
        name: 'Sudadera con Capucha',
        price: 45.99,
        quantity: 2,
        category: 'Sudaderas',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=400&h=400&fit=crop'
      }
    ],
    customerInfo: {
      name: 'Usuario Demo',
      email: 'usuario@demo.com',
      phone: '+1234567890',
      address: 'Calle Principal 123, Ciudad, País',
      notes: 'Llamar antes de entregar'
    },
    appliedCoupon: {
      code: 'DESCUENTO10',
      discount: 10
    },
    total: 163.77,
    createdAt: new Date('2024-01-25T11:20:00'),
    updatedAt: new Date('2024-01-25T11:20:00')
  },
  {
    id: 'order_004',
    userId: 'sample_user_id',
    status: 'pending',
    items: [
      {
        id: '6',
        name: 'Blusa Elegante Rosa',
        price: 55.00,
        quantity: 1,
        category: 'Blusas',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
      },
      {
        id: '7',
        name: 'Pantalón Formal Negro',
        price: 69.99,
        quantity: 1,
        category: 'Pantalones',
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-d405b4d85c4b?w=400&h=400&fit=crop'
      }
    ],
    customerInfo: {
      name: 'Usuario Demo',
      email: 'usuario@demo.com',
      phone: '+1234567890',
      address: 'Calle Principal 123, Ciudad, País'
    },
    total: 124.99,
    createdAt: new Date('2024-01-28T14:10:00'),
    updatedAt: new Date('2024-01-28T14:10:00')
  }
];

export const createSampleOrdersForUser = (userId) => {
  return sampleOrders.map(order => ({
    ...order,
    userId: userId,
    customerInfo: {
      ...order.customerInfo,
      email: 'usuario@demo.com' 
    }
  }));
};
