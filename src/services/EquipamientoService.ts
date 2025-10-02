import type { EquipamientoRequestDTO } from "../types/equipamiento/EquipamientoRequestDTO";
import type { EquipamientoResponseDTO } from "../types/equipamiento/EquipamientoResponseDTO";
import { BackendClient } from "./BackendClient";

export class EquipamientoService extends BackendClient<EquipamientoRequestDTO, EquipamientoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/equipment`)
    }

    /**
     * Crea un nuevo equipamiento (solo ADMIN)
     */
    async createEquipment(token: string, data: EquipamientoRequestDTO): Promise<EquipamientoResponseDTO> {
        console.log('🔵 [EquipamientoService.createEquipment] Creando equipamiento...', { data });
        try {
            const response = await fetch(`${this.baseUrl}/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            console.log('🟡 [EquipamientoService.createEquipment] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [EquipamientoService.createEquipment] Error:', errorText);
                throw new Error(`Error al crear equipamiento: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [EquipamientoService.createEquipment] Equipamiento creado:', result);
            return result;
        } catch (error) {
            console.error('❌ [EquipamientoService.createEquipment] Error:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los equipamientos (solo ADMIN)
     */
    async getAllEquipments(token: string): Promise<EquipamientoResponseDTO[]> {
        console.log('🔵 [EquipamientoService.getAllEquipments] Obteniendo equipamientos...');
        try {
            const response = await fetch(`${this.baseUrl}/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('🟡 [EquipamientoService.getAllEquipments] Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error al obtener equipamientos: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [EquipamientoService.getAllEquipments] Equipamientos obtenidos:', result.length);
            return result;
        } catch (error) {
            console.error('❌ [EquipamientoService.getAllEquipments] Error:', error);
            throw error;
        }
    }

    /**
     * Alterna el estado activo/inactivo de un equipamiento
     */
    async toggleActive(token: string, id: number): Promise<EquipamientoResponseDTO> {
        console.log('🔵 [EquipamientoService.toggleActive] Toggle equipamiento:', id);
        try {
            const response = await fetch(`${this.baseUrl}/admin/${id}/toggle-active`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('🟡 [EquipamientoService.toggleActive] Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error al cambiar estado: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [EquipamientoService.toggleActive] Estado cambiado:', result);
            return result;
        } catch (error) {
            console.error('❌ [EquipamientoService.toggleActive] Error:', error);
            throw error;
        }
    }

    /**
     * Desactiva un equipamiento (soft delete)
     */
    async deactivateEquipment(token: string, id: number): Promise<EquipamientoResponseDTO> {
        console.log('🔵 [EquipamientoService.deactivateEquipment] Desactivando equipamiento:', id);
        try {
            const response = await fetch(`${this.baseUrl}/admin/${id}/deactivate`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al desactivar equipamiento: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [EquipamientoService.deactivateEquipment] Equipamiento desactivado:', result);
            return result;
        } catch (error) {
            console.error('❌ [EquipamientoService.deactivateEquipment] Error:', error);
            throw error;
        }
    }

    /**
     * Elimina permanentemente un equipamiento (hard delete)
     */
    async hardDeleteEquipment(token: string, id: number): Promise<void> {
        console.log('🔵 [EquipamientoService.hardDeleteEquipment] Eliminando equipamiento:', id);
        try {
            const response = await fetch(`${this.baseUrl}/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('🟡 [EquipamientoService.hardDeleteEquipment] Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error al eliminar equipamiento: ${response.status}`);
            }

            console.log('✅ [EquipamientoService.hardDeleteEquipment] Equipamiento eliminado');
        } catch (error) {
            console.error('❌ [EquipamientoService.hardDeleteEquipment] Error:', error);
            throw error;
        }
    }
}