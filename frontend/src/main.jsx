import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  //this required cause whenever we switch tab it send request by default so we have to add this
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        if (queryKey[0] === 'authUser') {
          try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();

            if (data.error) {
              return null;
            }
            if (!res.ok) {
              throw new Error(data.error || "Something went wrong");
            }
            return data;
          } catch (error) {
            throw new Error(error);
          }
        }
        throw new Error('No queryFn for this query');
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
