import type { RutinaResponseDTO } from "../rutina/RutinaResponseDTO";
import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface AgendaResponseDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  reminderMinutes?: number;
  comment?: string;
  completed: boolean;
  completedAt?: string;
  routine: RutinaResponseDTO;
  user: UsuarioResponseDTO;

}
