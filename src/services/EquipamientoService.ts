import type { EquipamientoRequestDTO } from "../types/equipamiento/EquipamientoRequestDTO";
import type { EquipamientoResponseDTO } from "../types/equipamiento/EquipamientoResponseDTO";
import { BackendClient } from "./BackendClient";

export class EquipamientoService extends BackendClient<EquipamientoRequestDTO, EquipamientoResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/equipment`)
    }
}