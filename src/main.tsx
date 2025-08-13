import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { CalendarView } from './views/CalendarView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalendarView />
  </StrictMode>,
)
