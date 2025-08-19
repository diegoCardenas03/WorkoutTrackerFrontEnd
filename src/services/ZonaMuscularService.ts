import type { ZonaMuscularRequestDTO } from "../types/zonaMuscular/ZonaMuscularRequestDTO";
import type { ZonaMuscularResponseDTO } from "../types/zonaMuscular/ZonaMuscularResponseDTO";
import { BackendClient } from "./BackendClient";

export class ZonaMuscularService extends BackendClient<ZonaMuscularRequestDTO, ZonaMuscularResponseDTO> {
    constructor(){
        super(`${import.meta.env.VITE_API_BASEURL}/api/muscle-groups`)
    }
}