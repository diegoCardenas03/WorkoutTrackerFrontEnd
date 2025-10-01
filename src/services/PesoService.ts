import type { PesoRequestDTO } from "../types/peso/PesoRequestDTO";
import type { PesoResponseDTO } from "../types/peso/PesoResponseDTO";

class PesoService {
  private readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  private readonly BASE_PATH = '/api/body-weights';

  /**
   * Crea un nuevo registro de peso corporal
   * @param token - Token de acceso de Auth0
   * @param data - Datos del peso a registrar
   * @returns Registro de peso creado
   */
  async createBodyWeight(token: string, data: PesoRequestDTO): Promise<PesoResponseDTO> {
    const payload = {
      bodyWeight: parseFloat(data.bodyWeight.toString())
    };
    
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Error al registrar peso: ${response.statusText}`);
      } catch {
        throw new Error(`Error al registrar peso: ${response.statusText}`);
      }
    }

    return response.json();
  }

  /**
   * Obtiene el último registro de peso del usuario autenticado
   * @param token - Token de acceso de Auth0
   * @returns Último registro de peso
   */
  async getLastBodyWeight(token: string): Promise<PesoResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/last`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener último peso: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene todos los registros de peso del usuario autenticado
   * @param token - Token de acceso de Auth0
   * @returns Lista de registros de peso
   */
  async getAllBodyWeights(token: string): Promise<PesoResponseDTO[]> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener registros de peso: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Actualiza el último registro de peso del usuario autenticado
   * @param token - Token de acceso de Auth0
   * @param data - Datos del peso a actualizar
   * @returns Registro de peso actualizado
   */
  async updateLastBodyWeight(token: string, data: PesoRequestDTO): Promise<PesoResponseDTO> {
    // Asegurar que bodyWeight sea un número con decimales
    const payload = {
      bodyWeight: parseFloat(data.bodyWeight.toString())
    };
    
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar peso: ${response.statusText}`);
    }

    return response.json();
  }
}

export const pesoService = new PesoService();
