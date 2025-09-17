import { NextResponse } from 'next/server';

const KNOWN_PRODUCTS = {
  '8414533043720': {
    title: 'Cien años de soledad - Gabriel García Márquez',
    category: 'Libros',
    image: 'https://m.media-amazon.com/images/I/81s9QAXZ7VL._AC_UF1000,1000_QL80_.jpg',
    basePrice: 12.99,
    asin: 'B00E8KEYPC'
  }
};

const ASSOCIATE_TAG = 'precioreales-21';

function generatePrice(basePrice) {
  const variation = (Math.random() - 0.5) * 0.2;
  const finalPrice = basePrice * (1 + variation);
  return Math.max(finalPrice, 0.99).toFixed(2);
}

function generateAffiliateLink(asin) {
  return `https://www.amazon.es/dp/${asin}/?tag=${ASSOCIATE_TAG}`;
}

export async function POST(request) {
  try {
    const { barcode } = await request.json();
    
    if (!barcode || barcode.trim().length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Código de barras inválido'
      }, { status: 400 });
    }
    
    const cleanBarcode = barcode.trim();
    const productInfo = KNOWN_PRODUCTS[cleanBarcode];
    
    if (!productInfo) {
      return NextResponse.json({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404 });
    }
    
    const currentPrice = generatePrice(productInfo.basePrice);
    const affiliateLink = generateAffiliateLink(productInfo.asin);
    
    return NextResponse.json({
      success: true,
      product: {
        title: productInfo.title,
        price: currentPrice,
        image: productInfo.image,
        category: productInfo.category,
        barcode: cleanBarcode,
        affiliateLink: affiliateLink
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API funcionando',
    version: '1.0.0'
  });
}