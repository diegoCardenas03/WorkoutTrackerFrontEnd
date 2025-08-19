import type { MusculoRequestDTO } from "../types/musculo/MusculoRequestDTO";
import type { MusculoResponseDTO } from "../types/musculo/MusculoResponseDTO";
import { BackendClient } from "./BackendClient";

export class MusculoService extends BackendClient<MusculoRequestDTO, MusculoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscles`)
    }
}