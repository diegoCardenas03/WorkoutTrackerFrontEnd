import type { RolResponseDTO } from "../rol/RolResponseDTO";

export interface UsuarioResponseDTO {
  id: number;
  name: string;
  email: string;
  bodyWeight?: number;
  active: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  lastAccess?: string;
  completedWorkouts: number;
  createdRoutines: number;
  likedRoutines: number;
  savedRoutines: number;
  completedRoutines: number;
  favoriteExercises: number;
  role: RolResponseDTO;
}