import type { CategoriaResponseDTO } from "../categoria/CategoriaResponseDto";
import type { Dificultad } from "../enums/Dificultad";

export interface RutinaSimpleDTO {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  likesCount: number;
  difficulty: Dificultad;
  createdAt: string;
  updatedAt: string;
  category: CategoriaResponseDTO;
}