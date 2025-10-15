import type { RolResponseDTO } from "../rol/RolResponseDTO";

export interface UsuarioResponseDTO {
  id: number;
  name: string;
  email: string;
  bodyWeight?: number;
  active: boolean;
  pictureUrl?: string;
  picture?: string; // Añadido para compatibilidad con el backend
  createdAt: string;
  updatedAt: string;
  lastAccess?: string;
  completedWorkouts?: number; // Opcional porque no aparece en la respuesta del backend
  createdRoutines: number;
  likedRoutines: number;
  savedRoutines: number;
  completedRoutines: number;
  favoriteExercises: number;
  role: RolResponseDTO;
}