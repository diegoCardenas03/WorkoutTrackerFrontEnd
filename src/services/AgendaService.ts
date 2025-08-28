import type { AgendaRequestDTO } from "../types/agenda/AgendaRequestDTO";
import type { AgendaResponseDTO } from "../types/agenda/AgendaResponseDTO";
import { BackendClient } from "./BackendClient";

export class AgendaService extends BackendClient<AgendaRequestDTO, AgendaResponseDTO> {
  constructor() {
    super(`${import.meta.env.VITE_API_BASEURL}/api/schedules`);
  }

  async complete(id: number): Promise<AgendaResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Error al marcar como completada')
    }
    const data = await response.json()
    return data as AgendaResponseDTO
  }
}
