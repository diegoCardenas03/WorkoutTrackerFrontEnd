import type { MusculoRequestDTO } from "../types/musculo/MusculoRequestDTO";
import type { MusculoResponseDTO } from "../types/musculo/MusculoResponseDTO";
import { BackendClient } from "./BackendClient";

/**
 * Servicio para gestión de músculos
 * Usa métodos genéricos del BackendClient con endpoints /admin
 */
export class MusculoService extends BackendClient<MusculoRequestDTO, MusculoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscles`)
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
     * Crear un músculo (requiere token de admin)
     */
    async createMuscle(token: string, data: MusculoRequestDTO, image?: File): Promise<MusculoResponseDTO> {
        // console.log('🔵 [MusculoService.createMuscle] Creando músculo...');
        // console.log('🔵 [MusculoService.createMuscle] URL:', `${this.baseUrl}/admin`);
        // console.log('🔵 [MusculoService.createMuscle] Data:', data);
        // console.log('🔵 [MusculoService.createMuscle] Image:', image ? `${image.name} (${image.size} bytes)` : 'No image');
        
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

        // console.log('🔵 [MusculoService.createMuscle] Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al crear músculo' }))
            console.error('❌ [MusculoService.createMuscle] Error:', error);
            console.error('❌ [MusculoService.createMuscle] Status:', response.status);
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json();
        // console.log(`✅ [MusculoService.createMuscle] Músculo creado ${image ? '(con imagen)' : '(sin imagen)'}:`, result);
        return result;
    }

    /**
     * Actualizar un músculo (requiere token de admin)
     */
    async updateMuscle(token: string, id: number, data: MusculoRequestDTO, image?: File): Promise<MusculoResponseDTO> {
        // console.log('🔄 [MusculoService.updateMuscle] Actualizando músculo...');
        // console.log('🔄 [MusculoService.updateMuscle] URL:', `${this.baseUrl}/admin/${id}`);
        // console.log('🔄 [MusculoService.updateMuscle] Data:', data);
        // console.log('🔄 [MusculoService.updateMuscle] Image:', image ? `${image.name} (${image.size} bytes)` : 'No image');
        
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

        // console.log('🔄 [MusculoService.updateMuscle] Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al actualizar músculo' }))
            console.error('❌ [MusculoService.updateMuscle] Error:', error);
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json();
        // console.log(`✅ [MusculoService.updateMuscle] Músculo actualizado ${image ? '(con imagen)' : '(sin imagen)'}:`, result);
        return result;
    }
}