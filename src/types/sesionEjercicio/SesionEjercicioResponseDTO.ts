import type { EjercicioResponseDTO } from "../ejercicio/EjercicioResponseDTO";

export interface SesionEjercicioResponseDTO {
  id: number;
  sets: number;
  reps: number;
  restBetweenSets?: number;
  comment?: string;
  exercise: EjercicioResponseDTO;
}