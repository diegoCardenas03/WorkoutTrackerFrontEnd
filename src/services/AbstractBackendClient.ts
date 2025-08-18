// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBackendClient<RequestType, ResponseType> {
  protected baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract getAll(): Promise<ResponseType[]>;

  abstract getById(id: number): Promise<ResponseType | null>;

  abstract getByAuth0Id(id: string): Promise<ResponseType | null>;

  abstract post(data: RequestType): Promise<ResponseType>;
  abstract put(id: number, data: RequestType): Promise<ResponseType>;

  abstract putByAuth0Id(id: string, data: RequestType): Promise<ResponseType>;

  // Método abstracto para eliminar un elemento por su ID
  abstract delete(id: number): Promise<void>;

  abstract deletePhysical(id: number): Promise<void>;

  abstract deletePhysicalByAuth0Id(id: string): Promise<void>;
}