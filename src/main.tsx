import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { CommunityView } from './views/CommunityView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommunityView />
  </StrictMode>,
)
