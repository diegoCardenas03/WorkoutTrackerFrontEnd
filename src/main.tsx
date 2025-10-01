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
import { Auth0Provider } from '@auth0/auth0-react'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CallbackView } from './views/CallbackView'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route path='/about' element={<AboutUsView />} />
            <Route path='/landing' element={<LandingView />} />
            <Route path='/contact' element={<ContactUsView />} />
            <Route path='/callback' element={<CallbackView />} />

            {/* Rutas privadas - requieren autenticación */}
            <Route path="/" element={<ProtectedRoute><DashBoardView /></ProtectedRoute>} />
            <Route path="/routines" element={<ProtectedRoute><MyRoutinesView /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/catalog" element={<ProtectedRoute><CatalogView /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><MyProgressView /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityView /></ProtectedRoute>} />
            <Route path="/myProfile" element={<ProtectedRoute><MyProfileView /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><TrainingView /></ProtectedRoute>} />
            
            {/* Rutas de administración - privadas */}
            <Route path="/admin/profile" element={<ProtectedRoute><MyProfileAdminView /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute><EmployeesAdminView /></ProtectedRoute>} />
            <Route path="/admin/members" element={<ProtectedRoute><MembersAdminView /></ProtectedRoute>} />
            <Route path="/admin/exercises" element={<ProtectedRoute><ExercisesAdminView /></ProtectedRoute>} />
            <Route path="/admin/stats" element={<ProtectedRoute><StatsAdminView /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </StrictMode>,
)