import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { barcode, product, timestamp } = await request.json();
    
    if (!barcode || !product) {
      return NextResponse.json({
        success: false,
        error: 'Datos insuficientes'
      }, { status: 400 });
    }
    
    // Usar variables de entorno de Upstash
    const REDIS_URL = process.env.URL || process.env.UPSTASH_REDIS_REST_URL;
    const REDIS_TOKEN = process.env.TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      console.log('⚠️ KV no configurado, modo simulado');
      return NextResponse.json({
        success: true,
        data: {
          searchId: `sim:${Date.now()}`,
          totalSearches: Math.floor(Math.random() * 100) + 50,
          note: 'KV no configurado - datos simulados'
        }
      });
    }
    
    // Guardar en Redis/KV real
    const searchId = `search:${Date.now()}:${barcode}`;
    
    // Incrementar contador total
    const totalResponse = await fetch(`${REDIS_URL}/incr/total_searches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const totalData = await totalResponse.json();
    const totalSearches = totalData.result || 1;
    
    // Guardar búsqueda individual
    const searchData = {
      id: searchId,
      barcode,
      product: {
        title: product.title,
        price: product.price,
        category: product.category
      },
      timestamp: timestamp || new Date().toISOString()
    };
    
    await fetch(`${REDIS_URL}/set/${searchId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: JSON.stringify(searchData) })
    });
    
    console.log(`💾 Búsqueda guardada en KV: ${barcode} - Total: ${totalSearches}`);
    
    return NextResponse.json({
      success: true,
      data: {
        searchId,
        totalSearches,
        barcodeCount: 1
      }
    });
    
  } catch (error) {
    console.error('❌ Error guardando en KV:', error);
    return NextResponse.json({
      success: false,
      error: 'Error guardando datos'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
const REDIS_URL = process.env.KV_REST_API_URL || process.env.REDIS_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      return NextResponse.json({
        success: true,
        data: {
          totalSearches: 42,
          recentSearches: [],
          note: 'KV no configurado - datos simulados'
        }
      });
    }
    
    // Obtener total de búsquedas
    const totalResponse = await fetch(`${REDIS_URL}/get/total_searches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    });
    
    const totalData = await totalResponse.json();
    const totalSearches = totalData.result || 0;
    
    return NextResponse.json({
      success: true,
      data: {
        totalSearches,
        recentSearches: [],
        timestamp: new Date().toISOString(),
        note: 'KV conectado y funcionando ✅'
      }
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo stats:', error);
    return NextResponse.json({
      success: true,
      data: {
        totalSearches: 0,
        recentSearches: [],
        note: 'Error conectando KV'
      }
    });
  }
}