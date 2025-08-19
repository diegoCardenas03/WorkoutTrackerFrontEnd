import type { EjercicioRequestDTO } from "../types/ejercicio/EjercicioRequestDTO";
import type { EjercicioResponseDTO } from "../types/ejercicio/EjercicioResponseDTO";
import { BackendClient } from "./BackendClient";

export class EjercicioService extends BackendClient<EjercicioRequestDTO, EjercicioResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/exercises`)
    }
}