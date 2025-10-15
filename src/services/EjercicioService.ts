import type { EjercicioRequestDTO } from "../types/ejercicio/EjercicioRequestDTO";
import type { EjercicioResponseDTO } from "../types/ejercicio/EjercicioResponseDTO";
import { BackendClient } from "./BackendClient";

/**
 * Servicio para gestión de ejercicios
 * Usa métodos genéricos del BackendClient con endpoints /admin
 */
export class EjercicioService extends BackendClient<EjercicioRequestDTO, EjercicioResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/exercises`)
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
     * Override: Obtener todos los ejercicios (ADMIN - incluye inactivos)
     * GET /api/exercises/admin?relations=true
     */
    override async getAll(): Promise<EjercicioResponseDTO[]> {
        // console.log('🔵 [EjercicioService.getAll] Obteniendo todos los ejercicios (admin)...');
        const response = await fetch(`${this.baseUrl}/admin?relations=true`, {
            headers: this.getHeaders(),
        });
        
        if (!response.ok) {
            console.error('❌ [EjercicioService.getAll] Error:', response.status);
            throw new Error(`Error al obtener ejercicios: ${response.statusText}`);
        }
        
        const data = await response.json();
        // console.log('✅ [EjercicioService.getAll] Ejercicios obtenidos:', data.length);
        return data as EjercicioResponseDTO[];
    }

    /**
     * Override: Obtener ejercicio por ID (ADMIN)
     * GET /api/exercises/admin/{id}?relations=true
     */
    override async getById(id: number): Promise<EjercicioResponseDTO | null> {
        // console.log('🔵 [EjercicioService.getById] Obteniendo ejercicio:', id);
        const response = await fetch(`${this.baseUrl}/admin/${id}?relations=true`, {
            headers: this.getHeaders(),
        });
        
        if (!response.ok) {
            console.error('❌ [EjercicioService.getById] Error:', response.status);
            return null;
        }
        
        const data = await response.json();
        // console.log('✅ [EjercicioService.getById] Ejercicio obtenido:', data);
        return data as EjercicioResponseDTO;
    }

    /**
     * Override: Crear ejercicio (ADMIN)
     * POST /api/exercises/admin
     */
    override async post(data: EjercicioRequestDTO): Promise<EjercicioResponseDTO> {
        // console.log('🔵 [EjercicioService.post] Creando ejercicio...', data);
        const response = await fetch(`${this.baseUrl}/admin`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [EjercicioService.post] Error:', errorText);
            throw new Error(errorText);
        }
        
        const newData = await response.json();
        // console.log('✅ [EjercicioService.post] Ejercicio creado:', newData);
        return newData as EjercicioResponseDTO;
    }

    /**
     * Override: Actualizar ejercicio (ADMIN)
     * PATCH /api/exercises/admin/{id}
     */
    override async patch(id: number | string, data: EjercicioRequestDTO): Promise<EjercicioResponseDTO> {
        // console.log('🔵 [EjercicioService.patch] Actualizando ejercicio:', id);
        const response = await fetch(`${this.baseUrl}/admin/${id}`, {
            method: "PATCH",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [EjercicioService.patch] Error:', errorText);
            throw new Error(errorText);
        }
        
        const newData = await response.json();
        // console.log('✅ [EjercicioService.patch] Ejercicio actualizado:', newData);
        return newData as EjercicioResponseDTO;
    }

    /**
     * Toggle estado activo/inactivo
     * PATCH /api/exercises/admin/{id}/toggle-active
     */
    async toggleActive(id: number): Promise<any> {
        // console.log('🔵 [EjercicioService.toggleActive] Toggle ejercicio:', id);
        const response = await fetch(`${this.baseUrl}/admin/${id}/toggle-active`, {
            method: 'PATCH',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al cambiar estado' }));
            console.error('❌ [EjercicioService.toggleActive] Error:', error);
            throw new Error(error.message || 'Error al cambiar estado');
        }

        const result = await response.json();
        // console.log('✅ [EjercicioService.toggleActive] Estado cambiado:', result);
        return result;
    }

    /**
     * Desactivar ejercicio (soft delete)
     * PATCH /api/exercises/admin/{id}/deactivate
     */
    async deactivateExercise(id: number): Promise<any> {
        // console.log('🔵 [EjercicioService.deactivateExercise] Desactivando ejercicio:', id);
        const response = await fetch(`${this.baseUrl}/admin/${id}/deactivate`, {
            method: 'PATCH',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error al desactivar ejercicio' }));
            console.error('❌ [EjercicioService.deactivateExercise] Error:', error);
            throw new Error(error.message || 'Error al desactivar ejercicio');
        }

        const result = await response.json();
        // console.log('✅ [EjercicioService.deactivateExercise] Ejercicio desactivado:', result);
        return result;
    }

    /**
     * Obtener solo ejercicios activos (público - para usuarios)
     * GET /api/exercises?relations=true
     */
    async getAllActive(): Promise<EjercicioResponseDTO[]> {
        // console.log('🔵 [EjercicioService.getAllActive] Obteniendo ejercicios activos...');
        const response = await fetch(`${this.baseUrl}?relations=true`, {
            headers: this.getHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener ejercicios activos: ${response.statusText}`);
        }
        
        const data = await response.json();
        // console.log('✅ [EjercicioService.getAllActive] Ejercicios activos obtenidos:', data.length);
        return data as EjercicioResponseDTO[];
    }
}