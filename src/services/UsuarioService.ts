import { BackendClient } from './BackendClient'
import type { UsuarioRequestDTO } from '../types/usuario/UsuarioRequestDTO'
import type { UsuarioResponseDTO } from '../types/usuario/UsuarioResponseDTO'

export class UsuarioService extends BackendClient<UsuarioRequestDTO & { password?: string }, UsuarioResponseDTO> {
  constructor() {
    // ajusta la URL base según tu backend
    // usar el prefijo /api para ser consistente con otros servicios (ej: /api/users)
    super(`${import.meta.env.VITE_API_BASEURL}/api/users`)
  }

  // En el backend el endpoint para signup es /signup en otro controlador; crear método explícito
  async signup(data: { email: string; password: string; name?: string }): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Error en signup')
    }

    const json = await response.json()
    return json as UsuarioResponseDTO
  }

  // Implement abstract methods minimalmente redirigiendo a BackendClient
  async getAll(): Promise<UsuarioResponseDTO[]> { return super.getAll() }
  async getById(id: number): Promise<UsuarioResponseDTO | null> { return super.getById(id) }
  async getByAuth0Id(id: string): Promise<UsuarioResponseDTO | null> { return super.getByAuth0Id(id) }
  async post(data: UsuarioRequestDTO & { password?: string }): Promise<UsuarioResponseDTO> { return super.post(data) }
  async put(id: number, data: UsuarioRequestDTO & { password?: string }): Promise<UsuarioResponseDTO> { return super.put(id, data) }
  async putByAuth0Id(id: string, data: UsuarioRequestDTO & { password?: string }): Promise<UsuarioResponseDTO> { return super.putByAuth0Id(id, data) }
  async delete(id: number): Promise<void> { return super.delete(id) }
  async deletePhysical(id: number): Promise<void> { return super.deletePhysical(id) }
  async deletePhysicalByAuth0Id(id: string): Promise<void> { return super.deletePhysicalByAuth0Id(id) }
}
