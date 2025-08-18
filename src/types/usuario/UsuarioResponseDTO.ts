import type { RolResponseDTO } from "../rol/RolResponseDTO";

export interface UsuarioResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bodyWeight?: number;
  completedWorkouts: number;
  active: boolean;
  lastAccess?: string;
  roles: RolResponseDTO[];
}