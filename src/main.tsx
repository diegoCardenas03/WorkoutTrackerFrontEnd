import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MyRoutinesView } from './views/MyRoutinesView'
import { CommunityView } from './views/CommunityView'
import { CatalogView } from './views/CatalogView'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
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
import { RoleProtectedRoute } from './components/RoleProtectedRoute'
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
          {/* TODO: Eliminar UserRoleDebugger en producción */}
          {/* {import.meta.env.DEV && (
            <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 text-xs">
              <h3 className="font-bold mb-2">Debug: User Info</h3>
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify({
                  namespace: `${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`,
                  primaryRole: (window as any).__auth0User?.[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0] || "Sin rol",
                  allRoles: (window as any).__auth0User?.[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`] || [],
                  user: (window as any).__auth0User?.email || "No autenticado"
                }, null, 2)}
              </pre>
            </div>
          )} */}
          <Routes>
            {/* Rutas públicas */}
            <Route path='/about' element={<AboutUsView />} />
            <Route path='/landing' element={<LandingView />} />
            <Route path='/contact' element={<ContactUsView />} />
            <Route path='/callback' element={<CallbackView />} />

            {/* Rutas de usuario - solo para rol USUARIO */}
            <Route path="/" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><DashBoardView /></RoleProtectedRoute>} />
            <Route path="/routines" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><MyRoutinesView /></RoleProtectedRoute>} />
            <Route path="/calendar" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><CalendarView /></RoleProtectedRoute>} />
            <Route path="/catalog" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><CatalogView /></RoleProtectedRoute>} />
            <Route path="/progress" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><MyProgressView /></RoleProtectedRoute>} />
            <Route path="/community" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><CommunityView /></RoleProtectedRoute>} />
            <Route path="/myProfile" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><MyProfileView /></RoleProtectedRoute>} />
            <Route path="/training" element={<RoleProtectedRoute allowedRoles={['USUARIO']}><TrainingView /></RoleProtectedRoute>} />
            
            {/* Rutas de administración - solo para rol ADMIN */}
            <Route path="/admin/profile" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><MyProfileAdminView /></RoleProtectedRoute>} />
            <Route path="/admin/employees" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><EmployeesAdminView /></RoleProtectedRoute>} />
            <Route path="/admin/members" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><MembersAdminView /></RoleProtectedRoute>} />
            <Route path="/admin/exercises" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><ExercisesAdminView /></RoleProtectedRoute>} />
            <Route path="/admin/stats" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><StatsAdminView /></RoleProtectedRoute>} />
            
            {/* Ruta catch-all: redirige cualquier ruta inexistente al dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </StrictMode>,
)