export interface SesionEjercicioRequestDTO {
  sets: number;
  reps: number;
  restBetweenSets?: number;
  comment?: string;
  exerciseId: number;
}