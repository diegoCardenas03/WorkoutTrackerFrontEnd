import type { ZonaMuscularRequestDTO } from "../types/zonaMuscular/ZonaMuscularRequestDTO";
import type { ZonaMuscularResponseDTO } from "../types/zonaMuscular/ZonaMuscularResponseDTO";
import type { ZonaMuscularSimpleDTO } from "../types/zonaMuscular/ZonaMuscularSimpleDTO";
import { BackendClient } from "./BackendClient";

/**
 * Servicio para gestión de zonas musculares
 * Usa métodos genéricos del BackendClient con endpoints /admin
 */
export class ZonaMuscularService extends BackendClient<ZonaMuscularRequestDTO, ZonaMuscularResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscle-groups`)
    }

    // Los métodos admin ya están disponibles desde BackendClient:
    // - getAllAdmin(relations)
    // - getByIdAdmin(id, relations)
    // - postAdmin(data)
    // - patchAdmin(id, data)
    // - toggleActiveAdmin(id)
    // - deactivateAdmin(id)
    // - hardDeleteAdmin(id)

    /**
     * Crear una zona muscular (requiere token de admin)
     */
    async createMuscleZone(token: string, data: ZonaMuscularRequestDTO, image?: File): Promise<ZonaMuscularResponseDTO> {
        // console.log('🔵 [ZonaMuscularService.createMuscleZone] Creando zona muscular...');
        // console.log('🔵 [ZonaMuscularService.createMuscleZone] URL:', `${this.baseUrl}/admin`);
        // console.log('🔵 [ZonaMuscularService.createMuscleZone] Data:', data);
        // console.log('🔵 [ZonaMuscularService.createMuscleZone] Image:', image ? `${image.name} (${image.size} bytes)` : 'No image');
        
        // El backend siempre espera multipart/form-data
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        
        // Agregar imagen solo si existe
        if (image) {
            formData.append('image', image);
        }
        
        const response = await fetch(`${this.baseUrl}/admin`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        // console.log('🔵 [ZonaMuscularService.createMuscleZone] Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al crear zona muscular' }))
            console.error('❌ [ZonaMuscularService.createMuscleZone] Error:', error);
            console.error('❌ [ZonaMuscularService.createMuscleZone] Status:', response.status);
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json();
        // console.log(`✅ [ZonaMuscularService.createMuscleZone] Zona muscular creada ${image ? '(con imagen)' : '(sin imagen)'}:`, result);
        return result;
    }

    /**
     * Obtener todas las zonas musculares (admin - incluye inactivas)
     */
    async getAllMuscleZones(token: string, relations = false): Promise<ZonaMuscularResponseDTO[] | ZonaMuscularSimpleDTO[]> {
        const response = await fetch(`${this.baseUrl}/admin?relations=${relations}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Error al obtener zonas musculares')
        }

        return response.json()
    }

    /**
     * Obtener solo zonas musculares activas (público)
     */
    async getAllActiveMuscleZones(relations = false): Promise<ZonaMuscularResponseDTO[] | ZonaMuscularSimpleDTO[]> {
        const response = await fetch(`${this.baseUrl}?relations=${relations}`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error('Error al obtener zonas musculares activas')
        }

        return response.json()
    }

    /**
     * Obtener zona muscular por ID (admin)
     */
    async getMuscleZoneById(token: string, id: number, relations = false): Promise<ZonaMuscularResponseDTO | ZonaMuscularSimpleDTO> {
        const response = await fetch(`${this.baseUrl}/admin/${id}?relations=${relations}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Error al obtener zona muscular')
        }

        return response.json()
    }

    /**
     * Actualizar una zona muscular (requiere token de admin)
     */
    async updateMuscleZone(token: string, id: number, data: ZonaMuscularRequestDTO, image?: File): Promise<ZonaMuscularResponseDTO> {
        // console.log('🔄 [ZonaMuscularService.updateMuscleZone] Actualizando zona muscular...');
        // console.log('🔄 [ZonaMuscularService.updateMuscleZone] URL:', `${this.baseUrl}/admin/${id}`);
        // console.log('🔄 [ZonaMuscularService.updateMuscleZone] Data:', data);
        // console.log('🔄 [ZonaMuscularService.updateMuscleZone] Image:', image ? `${image.name} (${image.size} bytes)` : 'No image');
        
        // El backend siempre espera multipart/form-data
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        
        // Agregar imagen solo si existe
        if (image) {
            formData.append('image', image);
        }
        
        const response = await fetch(`${this.baseUrl}/admin/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        // console.log('🔄 [ZonaMuscularService.updateMuscleZone] Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al actualizar zona muscular' }))
            console.error('❌ [ZonaMuscularService.updateMuscleZone] Error:', error);
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json();
        // console.log(`✅ [ZonaMuscularService.updateMuscleZone] Zona muscular actualizada ${image ? '(con imagen)' : '(sin imagen)'}:`, result);
        return result;
    }

    /**
     * Alternar estado activo/inactivo
     */
    async toggleActive(token: string, id: number): Promise<ZonaMuscularSimpleDTO> {
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
     * Desactivar zona muscular (soft delete)
     */
    async deactivateMuscleZone(token: string, id: number): Promise<ZonaMuscularSimpleDTO> {
        const response = await fetch(`${this.baseUrl}/admin/${id}/deactivate`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al desactivar zona muscular' }))
            throw new Error(error.message || 'Error al desactivar zona muscular')
        }

        return response.json()
    }
}