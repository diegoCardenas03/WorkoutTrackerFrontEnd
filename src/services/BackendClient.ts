import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<RequestType, ResponseType> extends AbstractBackendClient<RequestType, ResponseType> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(): Promise<ResponseType[]> {
 
    const response = await fetch(`${this.baseUrl}?relations=true`, {
    });
    if (!response.ok) {
    
    }
    const data = await response.json();
    return data as ResponseType[];
  }

  async getById(id: number): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByEmail(email: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/email/${email}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByAuth0Id(id: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/auth0/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async post(data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    // const newData = await response.json();
    // return newData as ResponseType;
    return "objeto creado" as ResponseType;
  }

  async patch(id: number | string, data: RequestType): Promise<ResponseType> {
    const response =
      await fetch(`${this.baseUrl}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    // const newData = await response.json();
    return "objeto actualizado" as ResponseType;
  }

  async put(id: number, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar el estado del elemento con ID ${id}`);

    }
  }

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysical(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysicalByAuth0Id(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/auth0/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

}