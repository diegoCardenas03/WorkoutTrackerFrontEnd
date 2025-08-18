import type { SesionEjercicioRequestDTO } from "../sesionEjercicio/SesionEjercicioRequestDTO";
import type { DayOfWeek } from "../enums/DayOfWeek";

export interface SesionRequestDTO {
  name: string;
  description: string;
  dayOfWeek: DayOfWeek;
  categoryId: number;
  sessionExercises: SesionEjercicioRequestDTO[];
}