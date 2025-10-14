import type { RutinaRequestDTO } from "../types/rutina/RutinaRequestDTO";
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO";
import { BackendClient } from "./BackendClient";

export class RutinaService extends BackendClient<RutinaRequestDTO, RutinaResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/routines`)
    }

    /**
     * Toggle like en una rutina (dar o quitar like)
     * POST /api/routines/{id}/like
     */
    async toggleLikeRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.toggleLikeRoutine llamado para rutina:', id)
        const url = `${this.baseUrl}/${id}/like`
        console.log('🔵 URL:', url)
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('🔵 Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('🔴 Error response:', errorText)
            throw new Error(`Error al dar/quitar like a la rutina: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Toggle like exitoso, data:', data)
        return data;
    }

    /**
     * Toggle save en una rutina (guardar o quitar de guardadas)
     * POST /api/routines/{id}/save
     */
    async toggleSaveRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.toggleSaveRoutine llamado para rutina:', id)
        const url = `${this.baseUrl}/${id}/save`
        console.log('🔵 URL:', url)
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('🔵 Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('🔴 Error response:', errorText)
            throw new Error(`Error al guardar/quitar rutina: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Toggle save exitoso, data:', data)
        return data;
    }

    /**
     * Obtener las rutinas que el usuario ha dado like
     * GET /api/routines/liked
     */
    async getLikedRoutines(token: string): Promise<RutinaResponseDTO[]> {
        console.log('🔵 RutinaService.getLikedRoutines llamado')
        const url = `${this.baseUrl}/liked`
        console.log('🔵 URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('🔵 Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('🔴 Error response:', errorText)
            throw new Error(`Error al obtener rutinas con like: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Rutinas con like obtenidas, cantidad:', data?.length || 0)
        return data;
    }

    /**
     * Obtener las rutinas guardadas del usuario autenticado
     * GET /api/routines/saved
     */
    async getSavedRoutines(token: string): Promise<RutinaResponseDTO[]> {
        console.log('🔵 RutinaService.getSavedRoutines llamado')
        const url = `${this.baseUrl}/saved`
        console.log('🔵 URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('🔵 Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('🔴 Error response:', errorText)
            throw new Error(`Error al obtener rutinas guardadas: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Rutinas guardadas obtenidas, cantidad:', data?.length || 0)
        return data;
    }

    /**
     * Toggle completar/descompletar una rutina
     * POST /api/routines/{id}/complete
     * @returns El DTO actualizado de la rutina
     */
    async toggleCompleteRoutine(token: string, routineId: number): Promise<RutinaResponseDTO> {
        console.log(`🔵 POST /api/routines/${routineId}/complete`);
        const url = `${this.baseUrl}/${routineId}/complete`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`📡 Response: ${response.status} ${response.ok ? 'OK' : 'ERROR'}`);

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Error:', error);
            throw new Error(error || 'Error al marcar rutina como completada');
        }

        const data = await response.json();
        console.log(`✅ Usuario completedRoutines: ${data.user?.completedRoutines ?? 'N/A'}`);
        return data;
    }

    /**
     * Obtener rutinas completadas del usuario
     * GET /api/routines/completed
     */
    async getCompletedRoutines(token: string): Promise<RutinaResponseDTO[]> {
        console.log('🔵 [RutinaService] Obteniendo rutinas completadas');
        const url = `${this.baseUrl}/completed`
        console.log('🔵 [RutinaService] URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('📡 [RutinaService] Response status:', response.status);

        if (!response.ok) {
            console.error('❌ [RutinaService] Error:', response.status);
            throw new Error('Error al obtener rutinas completadas');
        }

        const data = await response.json();
        console.log('✅ [RutinaService] Rutinas completadas:', data.length);
        return data;
    }
}