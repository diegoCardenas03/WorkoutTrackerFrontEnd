import type { CategoriaResponseDTO } from "../categoria/CategoriaResponseDto";
import type { Dificultad } from "../enums/Dificultad";
import type { SesionResponseDTO } from "../sesion/SesionResponseDTO";
import type { UsuarioStatsDTO } from "../usuario/UsuarioStatsDTO";

export interface RutinaResponseDTO {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  likesCount: number;
  difficulty: Dificultad;
  createdAt: string;
  updatedAt: string;
  category: CategoriaResponseDTO;
  sessions: SesionResponseDTO[];
  user: UsuarioStatsDTO;
}