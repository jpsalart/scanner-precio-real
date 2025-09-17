import './globals.css'

export const metadata = {
  title: 'PrecioReal Scanner - Escanea y compara precios en Amazon',
  description: 'Escanea cualquier código de barras con tu móvil y descubre su precio en Amazon España. La primera herramienta española de comparación de precios.',
  keywords: 'scanner códigos barras, precios amazon, comparar precios, código barras móvil',
  author: 'PrecioReal',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'PrecioReal Scanner - Escanea y compara precios',
    description: 'La primera web española para escanear códigos de barras y comparar precios en Amazon',
    type: 'website',
    locale: 'es_ES',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics placeholder
              console.log('📊 Analytics initialized');
            `,
          }}
        />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📱</text></svg>" />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <div id="root">
          {children}
        </div>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ SW registered:', registration.scope);
                    })
                    .catch(function(registrationError) {
                      console.log('❌ SW registration failed:', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Error Handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                console.error('🐛 Global error:', e.error);
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                console.error('🐛 Unhandled promise rejection:', e.reason);
              });
            `,
          }}
        />
      </body>
    </html>
  )
}