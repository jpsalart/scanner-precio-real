'use client';

import { useState } from 'react';

export default function Home() {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchProduct = async (barcode) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.product);
        
        // ¡ESTA LÍNEA FALTABA! - Guardar búsqueda en KV
        await fetch('/api/save-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            barcode, 
            product: data.product,
            timestamp: new Date().toISOString()
          }),
        });
      }
    } catch (error) {
      console.error(error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', background: '#f3f4f6', padding: '20px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        
        <div style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>📱 PrecioReal Scanner</h1>
          <p style={{color: '#666'}}>Escanea productos y descubre precios Amazon</p>
        </div>

        <div style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '20px'}}>
          <h2 style={{textAlign: 'center', marginBottom: '20px'}}>🔍 Buscar Producto</h2>
          
          <div style={{display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto 20px auto'}}>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ej: 8414533043720"
              style={{flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}}
            />
            <button
              onClick={() => searchProduct(manualCode)}
              disabled={loading}
              style={{padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
            >
              {loading ? 'Buscando...' : '🔍 Buscar'}
            </button>
          </div>

          <div style={{textAlign: 'center'}}>
            <button
              onClick={() => searchProduct('8414533043720')}
              style={{padding: '10px 15px', background: '#e5e7eb', border: 'none', borderRadius: '5px', margin: '5px', cursor: 'pointer'}}
            >
              📚 Test: Libro
            </button>
          </div>
        </div>

        {result && (
          <div style={{background: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center'}}>
            <h3 style={{marginBottom: '15px'}}>✅ Producto Encontrado</h3>
            <h4 style={{marginBottom: '10px'}}>{result.title}</h4>
            <p style={{fontSize: '1.5rem', color: '#059669', fontWeight: 'bold', marginBottom: '15px'}}>
              💰 €{result.price}
            </p>
            <a 
              href={result.affiliateLink}
              target="_blank"
              style={{display: 'inline-block', padding: '15px 30px', background: '#f97316', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold'}}
            >
              🛒 Comprar en Amazon
            </a>
          </div>
        )}

        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <a 
            href="/stats"
            style={{display: 'inline-block', padding: '10px 20px', background: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '5px'}}
          >
            📊 Ver Estadísticas
          </a>
        </div>

      </div>
    </div>
  );
}