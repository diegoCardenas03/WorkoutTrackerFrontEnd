import type { MusculoSimpleDTO } from "../musculo/MusculoSimpleDTO";

export interface ZonaMuscularResponseDTO {
  id: number;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  muscles: MusculoSimpleDTO[];
}