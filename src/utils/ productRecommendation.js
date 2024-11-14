async function obtenerProductosRecomendados(condicion) {
    let categoria;
    switch (condicion.toLowerCase()) {
      case 'ph bajo':
        categoria = 'aumentador de pH';
        break;
      case 'ph alto':
        categoria = 'reductor de pH';
        break;
      case 'cloro bajo':
        categoria = 'cloro';
        break;
      default:
        categoria = 'mantenimiento general';
    }
    return await Product.find({ categoria });
  }
  
  module.exports = { obtenerProductosRecomendados };