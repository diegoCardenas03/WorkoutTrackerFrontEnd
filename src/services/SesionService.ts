import type { SesionRequestDTO } from "../types/sesion/SesionRequestDTO";
import type { SesionResponseDTO } from "../types/sesion/SesionResponseDTO";
import { BackendClient } from "./BackendClient";

export class SesionService extends BackendClient<SesionRequestDTO, SesionResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/routines`)
    }
}