import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { barcode, product } = await request.json();
    
    const REDIS_URL = process.env.KV_REST_API_URL;
    const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
    
    // Debug completo
    console.log('🔍 Debug completo:', {
      REDIS_URL: REDIS_URL,
      TOKEN_LENGTH: REDIS_TOKEN ? REDIS_TOKEN.length : 0,
      TOKEN_START: REDIS_TOKEN ? REDIS_TOKEN.substring(0, 10) + '...' : 'No existe'
    });
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      return NextResponse.json({
        success: true,
        data: { totalSearches: 999, note: 'Variables no configuradas' }
      });
    }
    
    // Probar con una llamada más simple primero
    console.log('🚀 URL completa:', `${REDIS_URL}/incr/total_searches`);
    
    const response = await fetch(`${REDIS_URL}/incr/total_searches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      return NextResponse.json({
        success: false,
        data: { 
          totalSearches: 0, 
          note: `Error KV: ${response.status} - ${errorText}`,
          debug: {
            url: `${REDIS_URL}/incr/total_searches`,
            status: response.status
          }
        }
      });
    }
    
    const data = await response.json();
    console.log('✅ Success:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        totalSearches: data.result || 1,
        searchId: `search_${Date.now()}`
      }
    });
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { totalSearches: 0, note: 'GET endpoint para debug' }
  });
}