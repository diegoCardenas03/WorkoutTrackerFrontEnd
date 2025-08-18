import type { RolResponseDTO } from "../rol/RolResponseDTO";

export interface UsuarioStatsDTO {
  id: number;
  name: string;
  email: string;
  bodyWeight?: number;
  completedWorkouts: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccess?: string;
  createdRoutines: number;
  likedRoutines: number;
  savedRoutines: number;
  completedRoutines: number;
  favoriteExercises: number;
  roles: RolResponseDTO[];
}