import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { barcode, product } = await request.json();
    
    console.log('🔍 Variables disponibles:', {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'Existe' : 'No existe',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'Existe' : 'No existe',
      REDIS_URL: process.env.REDIS_URL ? 'Existe' : 'No existe'
    });
    
    const REDIS_URL = process.env.KV_REST_API_URL;
    const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      console.log('⚠️ KV no configurado');
      return NextResponse.json({
        success: true,
        data: {
          totalSearches: 999,
          note: 'KV no configurado - modo simulado'
        }
      });
    }
    
    console.log('🚀 Intentando conectar a KV...');
    
    // Incrementar contador simple
    const response = await fetch(`${REDIS_URL}/incr/total_searches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Respuesta KV:', response.status);
    
    if (!response.ok) {
      throw new Error(`KV error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ KV respuesta:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        totalSearches: data.result || 1,
        searchId: `search_${Date.now()}`
      }
    });
    
  } catch (error) {
    console.error('❌ Error save-search:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

export async function GET() {
  const REDIS_URL = process.env.KV_REST_API_URL;
  const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
  
  if (!REDIS_URL) {
    return NextResponse.json({
      success: true,
      data: { totalSearches: 0, note: 'KV no configurado' }
    });
  }
  
  try {
    const response = await fetch(`${REDIS_URL}/get/total_searches`, {
      headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` }
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        totalSearches: data.result || 0,
        note: 'KV conectado y funcionando ✅'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: { totalSearches: 0, note: 'Error KV: ' + error.message }
    });
  }
}