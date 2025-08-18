export interface EjercicioRequestDTO {
  name: string;
  description: string;
  active?: boolean;
  tips?: string;
  instructions: Record<number, string>;
  sampleVideos: string[];
  equipmentIds?: number[];
  targetMuscleIds: number[];
}