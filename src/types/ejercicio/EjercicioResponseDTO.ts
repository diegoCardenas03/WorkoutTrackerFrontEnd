import type { EquipamientoResponseDTO } from "../equipamiento/EquipamientoResponseDTO";
import type { MusculoSimpleDTO } from "../musculo/MusculoSimpleDTO";

export interface EjercicioResponseDTO {
  id: number;
  name: string;
  description: string;
  active: boolean;
  tips?: string;
  createdAt: string;
  updatedAt: string;
  instructions: Record<number, string>;
  sampleVideos: string[];
  equipment: EquipamientoResponseDTO[];
  targetMuscles: MusculoSimpleDTO[];
}