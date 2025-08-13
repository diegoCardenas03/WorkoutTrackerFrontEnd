import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CatalogView } from './views/CatalogView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CatalogView />
  </StrictMode>,
)
