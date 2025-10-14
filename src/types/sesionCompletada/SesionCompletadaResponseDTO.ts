import type { RutinaSimpleDTO } from "../rutina/RutinaSimpleDTO";
import type { UsuarioStatsDTO } from "../usuario/UsuarioStatsDTO";

export interface SesionResponseDTO {
  id: number;
  user: UsuarioStatsDTO;
  session: RutinaSimpleDTO;
  sessionDate: string;
  registrationDate: string;
}