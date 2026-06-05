import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from 'sonner'
import InternetConnectionServicesProvider from '@/Provider/InternetConnection'
import { Provider } from 'react-redux'
import { persistor, store } from '@/app/store'
import { PersistGate } from 'redux-persist/integration/react'
import "@/lib/i18n"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <InternetConnectionServicesProvider >
            <App />
            <Toaster position='top-center' />
          </InternetConnectionServicesProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode >,
)
