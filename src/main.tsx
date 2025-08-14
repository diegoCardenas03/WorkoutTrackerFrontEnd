import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MyRoutinesView } from './views/MyRoutinesView'
import { CommunityView } from './views/CommunityView'
import { CatalogView } from './views/CatalogView'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashBoardView } from './views/DashBoardView'
import { CalendarView } from './views/CalendarView'
import { MyProgressView } from './views/MyProgressView'
import { MyProfileView } from './views/MyProfileView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoardView />} />
        <Route path="/routines" element={<MyRoutinesView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/progress" element={<MyProgressView />} />
        <Route path="/community" element={<CommunityView />} />
        <Route path="/myProfile" element={<MyProfileView/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)