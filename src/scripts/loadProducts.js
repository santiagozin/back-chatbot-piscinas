const mongoose = require('mongoose');
const Product = require('../models/Product');

// Conexión a la base de datos
mongoose.connect('mongodb+srv://santiagozin90:Jole2034-@cluster0.obrls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Lista de productos para cargar
const products = [
  {
    name: "Cloro granulado",
    description: "Cloro en gránulos para desinfección de piscinas",
    price: 15.99,
    category: "quimicos"
  },
  {
    name: "Regulador de pH+",
    description: "Aumenta el pH del agua de la piscina",
    price: 12.50,
    category: "quimicos"
  },
  {
    name: "Alguicida",
    description: "Previene y elimina algas en la piscina",
    price: 18.75,
    category: "quimicos"
  },
  {
    name: "Floculante",
    description: "Aglutina partículas pequeñas para facilitar su filtrado",
    price: 10.99,
    category: "quimicos"
  },
  {
    name: "Kit de prueba de agua",
    description: "Mide los niveles de cloro y pH del agua",
    price: 25.00,
    category: "mantenimiento"
  }
];

// Función para cargar los productos
async function loadProducts() {
  try {
    for (const product of products) {
      await Product.create(product);
      console.log(`Producto cargado: ${product.name}`);
    }
    console.log('Todos los productos han sido cargados');
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  } finally {
    mongoose.disconnect();
  }
}

loadProducts();