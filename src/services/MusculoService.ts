import type { MusculoRequestDTO } from "../types/musculo/MusculoRequestDTO";
import type { MusculoResponseDTO } from "../types/musculo/MusculoResponseDTO";
import type { MusculoSimpleDTO } from "../types/musculo/MusculoSimpleDTO";
import { BackendClient } from "./BackendClient";

export class MusculoService extends BackendClient<MusculoRequestDTO, MusculoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscles`)
    }

    /**
     * Crear un músculo (requiere token de admin)
     */
    async createMuscle(token: string, data: MusculoRequestDTO): Promise<MusculoResponseDTO> {
        console.log('🔵 [MusculoService.createMuscle] Creando músculo...');
        console.log('🔵 [MusculoService.createMuscle] URL:', `${this.baseUrl}/admin`);
        console.log('🔵 [MusculoService.createMuscle] Data:', data);
        
        const response = await fetch(`${this.baseUrl}/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        console.log('🔵 [MusculoService.createMuscle] Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al crear músculo' }))
            console.error('❌ [MusculoService.createMuscle] Error:', error);
            console.error('❌ [MusculoService.createMuscle] Status:', response.status);
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json();
        console.log('✅ [MusculoService.createMuscle] Músculo creado:', result);
        return result;
    }

    /**
     * Obtener todos los músculos (admin - incluye inactivos)
     */
    async getAllMuscles(token: string, relations = false): Promise<MusculoResponseDTO[] | MusculoSimpleDTO[]> {
        const response = await fetch(`${this.baseUrl}?relations=${relations}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Error al obtener músculos')
        }

        return response.json()
    }

    /**
     * Obtener solo músculos activos (público)
     */
    async getAllActiveMuscles(relations = false): Promise<MusculoResponseDTO[] | MusculoSimpleDTO[]> {
        const response = await fetch(`${this.baseUrl}?relations=${relations}`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error('Error al obtener músculos activos')
        }

        return response.json()
    }

    /**
     * Obtener músculo por ID (admin)
     */
    async getMuscleById(token: string, id: number, relations = false): Promise<MusculoResponseDTO | MusculoSimpleDTO> {
        const response = await fetch(`${this.baseUrl}/admin/${id}?relations=${relations}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Error al obtener músculo')
        }

        return response.json()
    }

    /**
     * Alternar estado activo/inactivo
     */
    async toggleActive(token: string, id: number): Promise<MusculoSimpleDTO> {
        const response = await fetch(`${this.baseUrl}/admin/${id}/toggle-active`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al cambiar estado' }))
            throw new Error(error.message || 'Error al cambiar estado')
        }

        return response.json()
    }

    /**
     * Desactivar músculo (soft delete)
     */
    async deactivateMuscle(token: string, id: number): Promise<MusculoSimpleDTO> {
        const response = await fetch(`${this.baseUrl}/admin/${id}/deactivate`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al desactivar músculo' }))
            throw new Error(error.message || 'Error al desactivar músculo')
        }

        return response.json()
    }
}