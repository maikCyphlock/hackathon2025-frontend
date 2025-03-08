import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner';
import App from './App.tsx'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <div className='bg-gray-100 min-h-screen flex justify-center items-center flex-col gap-5'>
        <h2 className='text-2xl font-extrabold flex justify-center items-center'>Crea tu mascota virtual</h2>
        <App />
      </div>

    </QueryClientProvider>

    <Toaster richColors />
  </StrictMode>,
)
