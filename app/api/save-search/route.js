import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { barcode, product } = await request.json();
    
    const REDIS_URL = process.env.KV_REST_API_URL;
    const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
    
    console.log('🔍 Iniciando save-search para:', barcode);
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      console.log('⚠️ Variables KV no configuradas');
      return NextResponse.json({
        success: true,
        data: { totalSearches: 999, note: 'KV no configurado - modo simulado' }
      });
    }
    
    try {
      // FORMATO CORRECTO para Upstash REST API
      console.log('🚀 Conectando a Upstash...');
      
      const response = await fetch(`${REDIS_URL}/incr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REDIS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['total_searches'])
      });
      
      console.log('📊 Upstash response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upstash error:', errorText);
        
        // Fallback en caso de error
        return NextResponse.json({
          success: true,
          data: { 
            totalSearches: Math.floor(Math.random() * 50) + 1,
            note: `Error KV (usando fallback): ${response.status}`
          }
        });
      }
      
      const data = await response.json();
      console.log('✅ Upstash success:', data);
      
      return NextResponse.json({
        success: true,
        data: {
          totalSearches: data.result || 1,
          searchId: `search_${Date.now()}`,
          note: 'KV funcionando correctamente'
        }
      });
      
    } catch (fetchError) {
      console.error('❌ Error de red:', fetchError);
      
      // Fallback en caso de error de red
      return NextResponse.json({
        success: true,
        data: { 
          totalSearches: Math.floor(Math.random() * 30) + 1,
          note: 'Error de conexión KV (usando fallback)'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error general save-search:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

export async function GET() {
  const REDIS_URL = process.env.KV_REST_API_URL;
  const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
  
  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({
      success: true,
      data: { totalSearches: 0, note: 'KV no configurado' }
    });
  }
  
  try {
    console.log('📊 Obteniendo stats de KV...');
    
    const response = await fetch(`${REDIS_URL}/get`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['total_searches'])
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Stats obtenidas:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        totalSearches: data.result || 0,
        timestamp: new Date().toISOString(),
        note: 'KV conectado y funcionando ✅'
      }
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo stats:', error);
    return NextResponse.json({
      success: true,
      data: { 
        totalSearches: 42, 
        note: 'Error KV (datos simulados): ' + error.message 
      }
    });
  }
}