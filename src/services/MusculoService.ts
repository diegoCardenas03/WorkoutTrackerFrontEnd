import type { MusculoRequestDTO } from "../types/musculo/MusculoRequestDTO";
import type { MusculoResponseDTO } from "../types/musculo/MusculoResponseDTO";
import { BackendClient } from "./BackendClient";

/**
 * Servicio para gestión de músculos
 * Usa métodos genéricos del BackendClient con endpoints /admin
 */
export class MusculoService extends BackendClient<MusculoRequestDTO, MusculoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscles`)
    }

    // Los métodos admin ya están disponibles desde BackendClient:
    // - getAllAdmin(relations)
    // - getByIdAdmin(id, relations)
    // - postAdmin(data)
    // - patchAdmin(id, data)
    // - toggleActiveAdmin(id)
    // - deactivateAdmin(id)
    // - hardDeleteAdmin(id)
}