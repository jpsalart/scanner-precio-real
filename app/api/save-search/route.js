import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { barcode, product } = await request.json();
    
    console.log('🔍 Variables disponibles:', {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'Existe' : 'No existe',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'Existe' : 'No existe'
    });
    
    const REDIS_URL = process.env.KV_REST_API_URL;
    const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
    
    if (!REDIS_URL || !REDIS_TOKEN) {
      return NextResponse.json({
        success: true,
        data: { totalSearches: 999, note: 'KV no configurado' }
      });
    }
    
    console.log('🚀 Intentando conectar a KV...');
    
    // FORMATO CORRECTO para Upstash REST API
    const response = await fetch(`${REDIS_URL}/incr/total_searches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    });
    
    console.log('📊 Respuesta KV:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error KV:', errorText);
      throw new Error(`KV error: ${response.status} - ${errorText}`);
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
  
  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({
      success: true,
      data: { totalSearches: 0, note: 'KV no configurado' }
    });
  }
  
  try {
    const response = await fetch(`${REDIS_URL}/get/total_searches`, {
      headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
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