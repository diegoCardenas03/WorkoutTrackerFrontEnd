import type { RutinaSimpleDTO } from "../rutina/RutinaSimpleDTO";
import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";
import type { ComentarioSimpleDTO } from "./ComentarioSimpleDTO";

export interface ComentarioResponseDTO {
  id: number;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: UsuarioResponseDTO;
  routine: RutinaSimpleDTO;
  replyTo?: ComentarioSimpleDTO;
  replies: ComentarioResponseDTO[];
}