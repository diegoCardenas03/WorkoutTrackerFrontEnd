import type { ZonaMuscularSimpleDTO } from "../zonaMuscular/ZonaMuscularSimpleDTO";

export interface MusculoResponseDTO {
  id: number;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  muscleGroup: ZonaMuscularSimpleDTO;
}