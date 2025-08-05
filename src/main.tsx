import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LandingView } from './views/LandingView'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingView />
  </StrictMode>,
)
