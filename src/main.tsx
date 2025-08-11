import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MyProfileView } from './views/MyProfileView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyProfileView />
  </StrictMode>,
)
