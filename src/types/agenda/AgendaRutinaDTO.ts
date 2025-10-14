import type { RutinaSimpleDTO } from "../rutina/RutinaSimpleDTO";

export interface AgendaResponseDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  reminderMinutes?: number;
  comment?: string;
  completed: boolean;
  completedAt?: string;
  routine: RutinaSimpleDTO;
}