# BrisaWear - E-commerce React Application

Una aplicación de e-commerce moderna desarrollada con React, Firebase y Bootstrap.

## Características

- **Diseño Responsivo**: Interfaz moderna y adaptable usando Bootstrap 5
- **Autenticación**: Sistema completo con Firebase Auth (registro, login, logout)
- **Catálogo de Productos**: Navegación por categorías y búsqueda avanzada
- **Carrito de Compras**: Funcionalidad completa con persistencia
- **Sistema de Cupones**: Descuentos aplicables en el checkout
- **Integración WhatsApp**: Envío de pedidos directamente por WhatsApp
- **Panel Administrativo**: Gestión de productos y pedidos
- **Rutas Protegidas**: Control de acceso basado en autenticación
- **Estado Global**: Manejo eficiente con Zustand

## Tecnologías Utilizadas

- **Frontend**: React 19, Vite
- **Estilos**: Bootstrap 5, CSS personalizado
- **Estado**: Zustand
- **Routing**: React Router DOM
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Iconos**: React Icons

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Ecommerce
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - El proyecto ya incluye la configuración de Firebase
   - Las credenciales están en `firebase.js`

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## Configuración

### Firebase
El proyecto está configurado con Firebase para:
- **Authentication**: Registro y login de usuarios
- **Firestore**: Base de datos para productos y pedidos
- **Storage**: Almacenamiento de imágenes (opcional)

### Datos de Prueba
La aplicación incluye datos de muestra que se cargan automáticamente si no hay productos en Firestore.

## Cuentas de Prueba

### Usuario Administrador
- **Email**: admin@brisawear.com
- **Contraseña**: admin123
- **Rol**: Administrador (acceso al panel admin)

### Usuario Regular
Puedes registrar cualquier usuario nuevo desde la página de registro.

## Funcionalidades Principales

### Para Usuarios
- **Explorar Productos**: Navegar por categorías y buscar productos
- **Carrito de Compras**: Agregar, modificar y eliminar productos
- **Cupones de Descuento**: Aplicar códigos promocionales
  - `DESCUENTO10`: 10% de descuento
  - `BIENVENIDO`: 15% de descuento  
  - `VERANO2024`: 20% de descuento
- **Checkout WhatsApp**: Enviar pedido directamente por WhatsApp

### Para Administradores
- **Gestión de Productos**: CRUD completo de productos
- **Gestión de Pedidos**: Ver y actualizar estado de pedidos
- **Panel de Control**: Estadísticas y administración

## Integración WhatsApp

Los pedidos se envían automáticamente por WhatsApp con:
- Información del cliente
- Detalles de productos
- Total del pedido
- Información de entrega

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── services/           # Servicios (Firebase, API)
├── store/              # Estado global (Zustand)
├── data/               # Datos de muestra
└── App.jsx             # Componente principal
```

## Despliegue

Para desplegar la aplicación:

1. **Construir el proyecto**
   ```bash
   npm run build
   ```

2. **Desplegar en Firebase Hosting** (opcional)
   ```bash
   firebase deploy
   ```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

**BrisaWear Team**
- Email: contacto@brisawear.com
- WhatsApp: +1234567890
