import type { CategoriaRequestDTO } from "../types/categoria/CategoriaRequestDTO";
import type { CategoriaResponseDTO } from "../types/categoria/CategoriaResponseDto";
import { BackendClient } from "./BackendClient";

export class CategoriaService extends BackendClient<CategoriaRequestDTO, CategoriaResponseDTO> {
    constructor(){
    super(`${import.meta.env.VITE_API_BASEURL}/api/categories`)
    }
}