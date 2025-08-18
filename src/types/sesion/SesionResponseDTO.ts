import type { CategoriaResponseDTO } from "../categoria/CategoriaResponseDto";
import type { DayOfWeek } from "../enums/DayOfWeek";
import type { SesionEjercicioResponseDTO } from "../sesionEjercicio/SesionEjercicioResponseDTO";

export interface SesionResponseDTO {
  id: number;
  name: string;
  description: string;
  dayOfWeek: DayOfWeek;
  createdAt: string;
  updatedAt: string;
  category: CategoriaResponseDTO;
  sessionExercises: SesionEjercicioResponseDTO[];
}