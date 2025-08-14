import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MyRoutinesView } from './views/MyRoutinesView'
import { CommunityView } from './views/CommunityView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyRoutinesView />
  </StrictMode>,
)
