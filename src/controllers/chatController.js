// src/controllers/chatController.js
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory  } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const Product = require('../models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
   {
     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
     threshold: HarmBlockThreshold.BLOCK_NONE,
   },
   {
     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
     threshold: HarmBlockThreshold.BLOCK_NONE,
   },
   {
     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
     threshold: HarmBlockThreshold.BLOCK_NONE,
   },
   {
     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
     threshold: HarmBlockThreshold.BLOCK_NONE,
   },
];

exports.handleChat = async (req, res) => {
  try {
    // Inicializar el modelo fuera del controlador para reutilizarlo
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: safetySettings
    });
    
    // Realizar búsquedas en paralelo usando Promise.all
    const [chat, products] = await Promise.all([
      Chat.findOne({ sessionId: req.body.sessionId }),
      Product.find({}).limit(10).lean(),
      // Usar lean() para consultas más rápidas
    ]);

    // Verifica que los datos necesarios estén presentes
    const { sessionId, message, userEmail } = req.body;
    if (!sessionId || !message || !userEmail) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Buscar o crear chat
    if (!chat) {
      chat = new Chat({
        sessionId,
        userEmail,
        messages: []
      });
    }

    // Añadir mensaje del usuario
    chat.messages.push({
      content: message,
      isBot: false
    });

    // Preparar el contexto de la conversación
    const conversationHistory = chat.messages.map(m => 
      `${m.isBot ? 'Asistente' : 'Usuario'}: ${m.content}`
    ).join('\n');

    // Simplificar el mapeo de productos
    const productList = products.map(p => `${p.name}: ${p.description}`).join('\n');

    // Optimizar el prompt para incluir el historial de la conversación
    const prompt = `Aquí está el historial de la conversación hasta ahora:\n${conversationHistory}\n\nComo vendedor argentino de productos para piscinas, responde de manera amigable y concisa. No saludes mas de una vez y recomienda productos de esta lista si son relevantes:\n${productList}\n\nPregunta del cliente: ${message}`;

    // Generar respuesta y guardar chat en paralelo
    const result = await model.generateContent(prompt);
    await chat.save();

    const response = await result.response;
    let botMessage = response.text();

    // Mejorar la lógica de detección de productos
    let recommendedProduct = null;
    const productNames = products.map(p => p.name.toLowerCase());
    
    // Buscar todos los productos mencionados en la respuesta
    for (const product of products) {
        if (botMessage.toLowerCase().includes(product.name.toLowerCase())) {
            recommendedProduct = {
                name: product.name,
                description: product.description,
                price: product.price
            };  
            break; // Tomar el primer producto encontrado
        }
    }

    // Añadir respuesta del bot
    chat.messages.push({
        content: botMessage,
        isBot: true
    });

    // Guardar chat
    await chat.save();

    res.json({
        message: botMessage,
        recommendedProduct: recommendedProduct
    });
  } catch (error) {
    console.error('Error en el controlador de chat:', error);
    res.status(500).json({ error: "Error procesando el mensaje" });
  }
};
