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
import { TrainingView } from './views/TrainingView'
import { AboutUsView } from './views/AboutUsView'
import { LandingView } from './views/LandingView'
import { ScrollToTop } from './components/ScrollToTop'
import { ContactUsView } from './views/ContactUsView'
import { MyProfileAdminView } from './views/admin/MyProfileAdminView'
import { EmployeesAdminView } from './views/admin/EmployeesAdminView'
import { MembersAdminView } from './views/admin/MembersAdminView'
import { ExercisesAdminView } from './views/admin/ExercisesAdminView'
import { StatsAdminView } from './views/admin/StatsAdminView'
import { Provider } from 'react-redux'
import { store } from './store'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<DashBoardView />} />
          <Route path="/routines" element={<MyRoutinesView />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/catalog" element={<CatalogView />} />
          <Route path="/progress" element={<MyProgressView />} />
          <Route path="/community" element={<CommunityView />} />
          <Route path="/myProfile" element={<MyProfileView />} />
          <Route path="/training" element={<TrainingView />} />

          <Route path='/about' element={<AboutUsView />} />
          <Route path='/landing' element={<LandingView />} />
          <Route path='/contact' element={<ContactUsView />} />
          <Route path="/admin/profile" element={<MyProfileAdminView />} />
          <Route path="/admin/employees" element={<EmployeesAdminView />} />
          <Route path="/admin/members" element={<MembersAdminView />} />
          <Route path="/admin/exercises" element={<ExercisesAdminView />} />
          <Route path="/admin/stats" element={<StatsAdminView />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)