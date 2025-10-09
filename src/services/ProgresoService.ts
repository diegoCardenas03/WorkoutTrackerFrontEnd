const API_BASE_URL = import.meta.env.VITE_API_BASEURL;

export interface RutinaCompletadaRequestDTO {
  routineId: number;
  scheduleId?: number; // Opcional: si viene de agenda
  completedAt?: string; // ISO string, si no se envía, backend usa fecha actual
}

export interface RutinaCompletadaResponseDTO {
  id: number;
  userId: number;
  routineId: number;
  scheduleId?: number;
  completedAt: string;
  routine?: {
    id: number;
    name: string;
  };
}

export class ProgresoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/progress`;
  }

  /**
   * Registrar una rutina como completada
   * POST /api/progress/complete-routine
   */
  async completeRoutine(token: string, dto: RutinaCompletadaRequestDTO): Promise<RutinaCompletadaResponseDTO> {
    console.log('🔵 [ProgresoService.completeRoutine] Registrando rutina completada:', dto);
    
    const response = await fetch(`${this.baseUrl}/complete-routine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ [ProgresoService.completeRoutine] Error:', error);
      throw new Error(error || 'Error al registrar rutina completada');
    }

    const data = await response.json();
    console.log('✅ [ProgresoService.completeRoutine] Rutina registrada:', data);
    return data;
  }

  /**
   * Obtener rutinas completadas del usuario en un rango de fechas
   * GET /api/progress/completed-routines?startDate=...&endDate=...
   */
  async getCompletedRoutines(
    token: string,
    startDate?: string,
    endDate?: string
  ): Promise<RutinaCompletadaResponseDTO[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${this.baseUrl}/completed-routines${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('🔵 [ProgresoService.getCompletedRoutines] URL:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ [ProgresoService.getCompletedRoutines] Error:', response.status);
      throw new Error('Error al obtener rutinas completadas');
    }

    const data = await response.json();
    console.log('✅ [ProgresoService.getCompletedRoutines] Rutinas obtenidas:', data.length);
    return data;
  }

  /**
   * Obtener estadísticas de progreso del mes actual
   * GET /api/progress/monthly-stats
   */
  async getMonthlyStats(token: string): Promise<{
    completedRoutines: number;
    totalScheduledSessions: number;
    completedScheduledSessions: number;
  }> {
    console.log('🔵 [ProgresoService.getMonthlyStats] Obteniendo estadísticas del mes');

    const response = await fetch(`${this.baseUrl}/monthly-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ [ProgresoService.getMonthlyStats] Error:', response.status);
      throw new Error('Error al obtener estadísticas mensuales');
    }

    const data = await response.json();
    console.log('✅ [ProgresoService.getMonthlyStats] Estadísticas:', data);
    return data;
  }
}

export const progresoService = new ProgresoService();
