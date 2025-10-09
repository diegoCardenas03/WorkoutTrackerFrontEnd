const API_BASE_URL = import.meta.env.VITE_API_BASEURL;

export interface ComentarioRequestDTO {
  content: string;
  routineId: number;
  replyToId?: number;
}

export interface ComentarioContentRequestDTO {
  content: string;
}

export class ComentarioService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/comments`;
  }

  /**
   * Crear un comentario o respuesta
   * POST /api/comments
   */
  async createComentario(token: string, dto: ComentarioRequestDTO): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al crear comentario');
    }

    return response.json();
  }

  /**
   * Obtener todos los comentarios de una rutina
   * GET /api/comments/routine/{routineId}
   */
  async getComentariosByRoutineId(token: string, routineId: number): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/routine/${routineId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener comentarios');
    }

    return response.json();
  }

  /**
   * Obtener comentarios del usuario autenticado
   * GET /api/comments/user/me
   */
  async getMyComentarios(token: string, relations = false): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/user/me?relations=${relations}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener mis comentarios');
    }

    return response.json();
  }

  /**
   * Actualizar contenido de un comentario
   * PATCH /api/comments/{id}
   */
  async updateComentarioContent(
    token: string,
    id: number,
    dto: ComentarioContentRequestDTO
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al actualizar comentario');
    }

    return response.json();
  }

  /**
   * Dar/quitar like a un comentario
   * PATCH /api/comments/{id}/like
   */
  async toggleLikeComentario(token: string, id: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${id}/like`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al dar like al comentario');
    }

    return response.json();
  }

  /**
   * Obtener comentarios que el usuario ha dado like
   * GET /api/comments/liked
   */
  async getLikedComentarios(token: string): Promise<any[]> {
    console.log('🔵 [ComentarioService.getLikedComentarios] Obteniendo comentarios con like del usuario');
    const response = await fetch(`${this.baseUrl}/liked`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ [ComentarioService.getLikedComentarios] Error:', response.status);
      throw new Error('Error al obtener comentarios con like');
    }

    const data = await response.json();
    console.log('✅ [ComentarioService.getLikedComentarios] Comentarios obtenidos:', data.length);
    return data;
  }

  /**
   * Eliminar propio comentario (usuario)
   * DELETE /api/comments/{id}
   */
  async deleteOwnComentario(token: string, id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al eliminar comentario');
    }
  }

  /**
   * Eliminar un comentario (admin)
   * DELETE /api/comments/admin/{id}
   */
  async deleteComentarioAdmin(token: string, id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar comentario');
    }
  }
}

export const comentarioService = new ComentarioService();
