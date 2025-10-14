import type { SesionResponseDTO } from '../types/sesionCompletada/SesionCompletadaResponseDTO'

/**
 * Servicio para obtener las sesiones completadas del usuario
 * Estas sesiones son registradas por el backend cuando se completa una rutina
 */
export class SesionCompletadaService {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_API_BASEURL}/api/completed-sessions`
  }

  /**
   * Obtiene todas las sesiones completadas del usuario autenticado
   * GET /api/completed-sessions
   */
  async getAllCompletedSessions(token: string): Promise<SesionResponseDTO[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener las sesiones completadas`)
    }

    return response.json()
  }
}
