import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ProductsProvider } from './contexts/ProductsContext'
import { PromoCodesProvider } from './contexts/PromoCodesContext'
import { OrdersProvider } from './contexts/OrdersContext'
import { AdminProvider } from './contexts/AdminContext'
import { AlertProvider } from './contexts/AlertContext'
import ScrollToTop from './components/ScrollToTop'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
            <AdminProvider>
              <ProductsProvider>
                <PromoCodesProvider>
                  <CartProvider>
                  <WishlistProvider>
                    <OrdersProvider>
                      <ScrollToTop />
                      <App />
                      <Toaster />
                    </OrdersProvider>
                  </WishlistProvider>
                </CartProvider>
                </PromoCodesProvider>
              </ProductsProvider>
            </AdminProvider>
          </AlertProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)