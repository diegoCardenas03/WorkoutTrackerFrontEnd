import type { RutinaRequestDTO } from "../types/rutina/RutinaRequestDTO";
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO";
import { BackendClient } from "./BackendClient";

export class RutinaService extends BackendClient<RutinaRequestDTO, RutinaResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/routines`)
    }

    /**
     * Dar like a una rutina
     * POST /api/routines/{id}/like
     */
    async likeRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.likeRoutine llamado para rutina:', id)
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
            throw new Error(`Error al dar like a la rutina: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Like exitoso, data:', data)
        return data;
    }

    /**
     * Quitar like de una rutina
     * POST /api/routines/{id}/unlike
     */
    async unlikeRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.unlikeRoutine llamado para rutina:', id)
        const url = `${this.baseUrl}/${id}/unlike`
        console.log('🔵 URL:', url)
        console.log('🔵 Token length:', token?.length || 0)
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('🔵 Response status:', response.status)
        console.log('🔵 Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorText = await response.text()
            console.error('🔴 Error response:', errorText)
            console.error('🔴 Status:', response.status, response.statusText)
            throw new Error(`Error al quitar like de la rutina: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Unlike exitoso, data:', data)
        return data;
    }

    /**
     * Guardar/Marcar una rutina como guardada
     * POST /api/routines/{id}/save
     */
    async saveRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.saveRoutine llamado para rutina:', id)
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
            throw new Error(`Error al guardar la rutina: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Save exitoso, data:', data)
        return data;
    }

    /**
     * Quitar rutina de guardadas
     * POST /api/routines/{id}/unsave
     */
    async unsaveRoutine(token: string, id: number): Promise<any> {
        console.log('🔵 RutinaService.unsaveRoutine llamado para rutina:', id)
        const url = `${this.baseUrl}/${id}/unsave`
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
            throw new Error(`Error al quitar rutina de guardadas: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('🟢 Unsave exitoso, data:', data)
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
}