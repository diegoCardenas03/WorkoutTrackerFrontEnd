import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<RequestType, ResponseType> extends AbstractBackendClient<RequestType, ResponseType> {
  protected token: string | null = null;

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  setToken(token: string) {
    this.token = token;
  }

  protected getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async getAll(): Promise<ResponseType[]> {
    console.log(`🔵 [BackendClient.getAll] GET ${this.baseUrl}?relations=true`)
    const response = await fetch(`${this.baseUrl}?relations=true`, {
      headers: this.getHeaders(),
    });
    
    console.log(`🟡 [BackendClient.getAll] Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ [BackendClient.getAll] Error: ${response.status} - ${errorText}`)
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [BackendClient.getAll] Datos obtenidos:`, data.length, 'elementos')
    return data as ResponseType[];
  }

  async getById(id: number): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/${id}?relations=true`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByEmail(email: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/email/${email}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByAuth0Id(id: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/auth0/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async post(data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  async patch(id: number | string, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  async put(id: number, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  async putByAuth0Id(id: string, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/auth0/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  // Metodo para actualizar el estado (activo = true o activo = false)
  async updateEstado(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/toggle-activo/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar el estado del elemento con ID ${id}`);
    }
  }

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysical(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysicalByAuth0Id(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/auth0/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  // ========================================
  // 🔐 MÉTODOS ADMIN (requieren rol ADMIN)
  // ========================================

  /**
   * Obtener todos los elementos (admin - incluye inactivos)
   * GET /api/{resource}/admin?relations=true
   */
  async getAllAdmin(relations = true): Promise<ResponseType[]> {
    console.log(`🔵 [BackendClient.getAllAdmin] GET ${this.baseUrl}/admin?relations=${relations}`);
    const response = await fetch(`${this.baseUrl}/admin?relations=${relations}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      console.error(`❌ [BackendClient.getAllAdmin] Error:`, response.status);
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [BackendClient.getAllAdmin] Obtenidos: ${data.length} elementos`);
    return data as ResponseType[];
  }

  /**
   * Obtener elemento por ID (admin)
   * GET /api/{resource}/admin/{id}?relations=true
   */
  async getByIdAdmin(id: number, relations = true): Promise<ResponseType | null> {
    console.log(`🔵 [BackendClient.getByIdAdmin] GET ${this.baseUrl}/admin/${id}?relations=${relations}`);
    const response = await fetch(`${this.baseUrl}/admin/${id}?relations=${relations}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      console.error(`❌ [BackendClient.getByIdAdmin] Error:`, response.status);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ [BackendClient.getByIdAdmin] Elemento obtenido:`, data);
    return data as ResponseType;
  }

  /**
   * Crear elemento (admin)
   * POST /api/{resource}/admin
   */
  async postAdmin(data: RequestType): Promise<ResponseType> {
    console.log(`🔵 [BackendClient.postAdmin] POST ${this.baseUrl}/admin`, data);
    const response = await fetch(`${this.baseUrl}/admin`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al crear' }));
      console.error(`❌ [BackendClient.postAdmin] Error:`, error);
      throw new Error(error.message || 'Error al crear');
    }
    
    const newData = await response.json();
    console.log(`✅ [BackendClient.postAdmin] Elemento creado:`, newData);
    return newData as ResponseType;
  }

  /**
   * Actualizar elemento (admin)
   * PATCH /api/{resource}/admin/{id}
   */
  async patchAdmin(id: number | string, data: RequestType | Partial<RequestType>): Promise<ResponseType> {
    console.log(`🔵 [BackendClient.patchAdmin] PATCH ${this.baseUrl}/admin/${id}`, data);
    const response = await fetch(`${this.baseUrl}/admin/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al actualizar' }));
      console.error(`❌ [BackendClient.patchAdmin] Error:`, error);
      throw new Error(error.message || 'Error al actualizar');
    }
    
    const newData = await response.json();
    console.log(`✅ [BackendClient.patchAdmin] Elemento actualizado:`, newData);
    return newData as ResponseType;
  }

  /**
   * Toggle estado activo/inactivo (admin)
   * PATCH /api/{resource}/admin/{id}/toggle-active
   */
  async toggleActiveAdmin(id: number): Promise<any> {
    console.log(`🔵 [BackendClient.toggleActiveAdmin] PATCH ${this.baseUrl}/admin/${id}/toggle-active`);
    const response = await fetch(`${this.baseUrl}/admin/${id}/toggle-active`, {
      method: "PATCH",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al cambiar estado' }));
      console.error(`❌ [BackendClient.toggleActiveAdmin] Error:`, error);
      throw new Error(error.message || 'Error al cambiar estado');
    }

    const result = await response.json();
    console.log(`✅ [BackendClient.toggleActiveAdmin] Estado cambiado:`, result);
    return result;
  }

  /**
   * Desactivar elemento (soft delete) (admin)
   * PATCH /api/{resource}/admin/{id}/deactivate
   */
  async deactivateAdmin(id: number): Promise<any> {
    console.log(`🔵 [BackendClient.deactivateAdmin] PATCH ${this.baseUrl}/admin/${id}/deactivate`);
    const response = await fetch(`${this.baseUrl}/admin/${id}/deactivate`, {
      method: "PATCH",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al desactivar' }));
      console.error(`❌ [BackendClient.deactivateAdmin] Error:`, error);
      throw new Error(error.message || 'Error al desactivar');
    }

    const result = await response.json();
    console.log(`✅ [BackendClient.deactivateAdmin] Elemento desactivado:`, result);
    return result;
  }

  /**
   * Eliminar permanentemente (hard delete) (admin)
   * DELETE /api/{resource}/admin/{id}
   */
  async hardDeleteAdmin(id: number): Promise<void> {
    console.log(`🔵 [BackendClient.hardDeleteAdmin] DELETE ${this.baseUrl}/admin/${id}`);
    const response = await fetch(`${this.baseUrl}/admin/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      console.error(`❌ [BackendClient.hardDeleteAdmin] Error:`, response.status);
      throw new Error(`Error al eliminar: ${response.statusText}`);
    }

    console.log(`✅ [BackendClient.hardDeleteAdmin] Elemento eliminado permanentemente`);
  }

}