import type { MusculoEmbeddedDTO } from "../musculo/MusculoEmbeddedDTO";

export interface ZonaMuscularRequestDTO {
  name: string;
  active?: boolean;
  muscles?: MusculoEmbeddedDTO[];
}