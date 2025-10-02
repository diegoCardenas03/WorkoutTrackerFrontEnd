export interface UsuarioResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bodyWeight?: number;
  completedWorkouts: number;
  active: boolean;
  lastAccess?: string;
}

export interface UpdateUsuarioDTO {
  name?: string;
  password?: string;
}

class UsuarioService {
  private readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  private readonly BASE_PATH = '/api/users';

  /**
   * Registra o obtiene un usuario en el backend usando el token JWT de Auth0
   * @param token - Token de acceso de Auth0
   * @returns Usuario registrado o existente
   */
  async signupUser(token: string): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al registrar usuario: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Registra o obtiene un usuario en el backend usando el token JWT de Auth0
   * @param token - Token de acceso de Auth0
   * @returns Usuario registrado o existente
   */
  async signupAdminUser(token: string): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al registrar usuario: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @param token - Token de acceso de Auth0
   * @returns Perfil del usuario
   */
  async getProfile(token: string): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener perfil: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene el usuario actual desde el backend (sin crear)
   * @param token - Token de acceso de Auth0
   * @returns Usuario si existe
   * @throws Error si el usuario no existe
   */
  async getCurrentUser(token: string): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener usuario actual: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene o registra un usuario en el backend
   * Primero intenta obtener el usuario existente, si no existe lo crea con signup
   * @param token - Token de acceso de Auth0
   * @returns Usuario obtenido o registrado
   */
  async getOrCreateUser(token: string): Promise<UsuarioResponseDTO> {
    try {
      // Primero intentar obtener el usuario existente
      console.log('Verificando si el usuario ya existe...');
      const existingUser = await this.getCurrentUser(token);
      console.log('Usuario existente encontrado:', existingUser);
      return existingUser;
    } catch (error) {
      // Si el usuario no existe, registrarlo
      console.log('Usuario no existe, procediendo a registrar...');
      const newUser = await this.signupUser(token);
      console.log('Usuario registrado exitosamente:', newUser);
      return newUser;
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * @param token - Token de acceso de Auth0
   * @param data - Datos a actualizar (nombre y/o contraseña)
   * @returns Usuario actualizado
   */
  async updateProfile(token: string, data: UpdateUsuarioDTO): Promise<UsuarioResponseDTO> {
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar perfil: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Establece el nombre de usuario para el usuario autenticado
   * @param token - Token de acceso de Auth0
   * @param name - Nombre de usuario a establecer
   * @returns Usuario actualizado
   */
  async setUsername(token: string, name: string): Promise<UsuarioResponseDTO> {
    return this.updateProfile(token, { name });
  }
}

export const usuarioService = new UsuarioService();
