import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log('Guardando búsqueda:', data.barcode);
    
    return NextResponse.json({
      success: true,
      data: {
        searchId: `search_${Date.now()}`,
        totalSearches: Math.floor(Math.random() * 100) + 50,
        barcodeCount: Math.floor(Math.random() * 5) + 1
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error guardando datos'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      totalSearches: 42,
      recentSearches: [
        {
          barcode: '8414533043720',
          product: { 
            title: 'Cien años de soledad',
            price: '12.99',
            category: 'Libros'
          },
          timestamp: new Date().toISOString()
        }
      ],
      timestamp: new Date().toISOString()
    }
  });
}