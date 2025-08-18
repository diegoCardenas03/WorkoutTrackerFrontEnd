import type { Dificultad } from "../enums/Dificultad";
import type { SesionRequestDTO } from "../sesion/SesionRequestDTO";

export interface RutinaRequestDTO {
  name: string;
  description?: string;
  isPublic: boolean;
  difficulty: Dificultad;
  categoryId: number;
  sessions: SesionRequestDTO[];
  userId: number;
}