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
    const response = await fetch(`${this.baseUrl}?relations=true`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    const data = await response.json();
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
    const response = await fetch(`${this.baseUrl}/delete/${id}`, {
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

}