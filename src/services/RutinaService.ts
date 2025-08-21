import type { RutinaRequestDTO } from "../types/rutina/RutinaRequestDTO";
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO";
import { BackendClient } from "./BackendClient";

export class RutinaService extends BackendClient<RutinaRequestDTO, RutinaResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/routines`)
    }
}