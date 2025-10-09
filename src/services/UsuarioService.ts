import type { UsuarioResponseDTO } from '../types/usuario/UsuarioResponseDTO';
import type { UsuarioUpdateRequestDTO } from '../types/usuario/UsuarioUpdateRequestDTO';

class UsuarioService {
  private readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  private readonly BASE_PATH = '/api/users';

  /**
   * Registra o obtiene un usuario en el backend usando el token JWT de Auth0
   * @param token - Token de acceso de Auth0
   * @returns Usuario registrado o existente
   */
  async signupUser(token: string): Promise<UsuarioResponseDTO> {
    console.log('🔵 [UsuarioService.signupUser] Iniciando registro de usuario...');
    console.log('🔵 [UsuarioService.signupUser] URL:', `${this.BASE_URL}${this.BASE_PATH}/signup`);
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

    const userData = await response.json();
    console.log('✅ [UsuarioService.signupUser] Usuario registrado exitosamente:', userData);
    return userData;
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
    console.log('🟡 [UsuarioService.getCurrentUser] Obteniendo usuario actual...');
    console.log('🟡 [UsuarioService.getCurrentUser] URL:', `${this.BASE_URL}${this.BASE_PATH}/me`);
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log('❌ [UsuarioService.getCurrentUser] Usuario no encontrado (404) - procederá a crear');
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener usuario actual: ${response.statusText}`);
    }

    const userData = await response.json();
    console.log('✅ [UsuarioService.getCurrentUser] Usuario encontrado:', userData);
    return userData;
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
   * Actualiza el perfil del usuario autenticado usando PATCH
   * @param token - Token de acceso de Auth0
   * @param data - Datos a actualizar (nombre y/o contraseña)
   * @param image - Imagen de perfil opcional (File)
   * @returns Usuario actualizado
   */
  async updateProfile(token: string, data: UsuarioUpdateRequestDTO, image?: File): Promise<UsuarioResponseDTO> {
    console.log('🔄 [UsuarioService.updateProfile] Actualizando perfil...');
    console.log('🔄 [UsuarioService.updateProfile] URL:', `${this.BASE_URL}${this.BASE_PATH}`);
    console.log('🔄 [UsuarioService.updateProfile] Data:', data);
    console.log('🔄 [UsuarioService.updateProfile] Image:', image ? `${image.name} (${image.size} bytes)` : 'No image');
    
    // El backend siempre espera multipart/form-data, así que siempre usamos FormData
    const formData = new FormData();
    
    // Agregar los datos como JSON en un blob
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    
    // Agregar imagen solo si existe
    if (image) {
      formData.append('image', image);
    }
    
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        // NO establecer Content-Type - el navegador lo hace automáticamente con el boundary correcto
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [UsuarioService.updateProfile] Error:', errorData);
      throw new Error(errorData.message || `Error al actualizar perfil: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ [UsuarioService.updateProfile] Perfil actualizado ${image ? '(con imagen)' : '(sin imagen)'}:`, result);
    return result;
  }

  /**
   * Establece el nombre de usuario para el usuario autenticado
   * @param token - Token de acceso de Auth0
   * @param name - Nombre de usuario a establecer
   * @param image - Imagen de perfil opcional (File)
   * @returns Usuario actualizado
   */
  async setUsername(token: string, name: string, image?: File): Promise<UsuarioResponseDTO> {
    return this.updateProfile(token, { name }, image);
  }

  /**
   * Obtiene todos los usuarios con rol USER
   * @param token - Token de acceso de Auth0
   * @returns Lista de usuarios
   */
  async getAllUsers(token: string): Promise<UsuarioResponseDTO[]> {
    console.log('🔵 [UsuarioService.getAllUsers] Obteniendo usuarios...');
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [UsuarioService.getAllUsers] Error:', errorData);
      throw new Error(errorData.message || `Error al obtener usuarios: ${response.statusText}`);
    }

    const users = await response.json();
    console.log('✅ [UsuarioService.getAllUsers] Usuarios obtenidos:', users.length);
    return users;
  }

  /**
   * Obtiene todos los usuarios con rol ADMIN
   * @param token - Token de acceso de Auth0
   * @returns Lista de administradores
   */
  async getAllAdmins(token: string): Promise<UsuarioResponseDTO[]> {
    console.log('🔵 [UsuarioService.getAllAdmins] Obteniendo administradores...');
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/admin/admins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [UsuarioService.getAllAdmins] Error:', errorData);
      throw new Error(errorData.message || `Error al obtener administradores: ${response.statusText}`);
    }

    const admins = await response.json();
    console.log('✅ [UsuarioService.getAllAdmins] Administradores obtenidos:', admins.length);
    return admins;
  }

  /**
   * Registra un nuevo administrador en Auth0 y en el backend
   * @param token - Token de acceso de Auth0
   * @param data - Datos del nuevo administrador (email, password, name)
   * @returns Administrador registrado
   */
  async registerAdmin(token: string, data: { email: string; password: string; name?: string }): Promise<UsuarioResponseDTO> {
    console.log('🔵 [UsuarioService.registerAdmin] Registrando nuevo administrador...');
    console.log('🔵 [UsuarioService.registerAdmin] Data:', { email: data.email, name: data.name });
    
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [UsuarioService.registerAdmin] Error:', errorData);
      throw new Error(errorData.message || `Error al registrar administrador: ${response.statusText}`);
    }

    const admin = await response.json();
    console.log('✅ [UsuarioService.registerAdmin] Administrador registrado:', admin);
    return admin;
  }

  /**
   * Activa o desactiva un usuario (toggle)
   * @param token - Token de acceso de Auth0
   * @param userId - ID del usuario
   * @returns Usuario actualizado
   */
  async toggleUserActive(token: string, userId: number): Promise<UsuarioResponseDTO> {
    console.log('🔵 [UsuarioService.toggleUserActive] Toggle active para usuario:', userId);
    
    const response = await fetch(`${this.BASE_URL}${this.BASE_PATH}/admin/${userId}/toggle-active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [UsuarioService.toggleUserActive] Error:', errorData);
      throw new Error(errorData.message || `Error al cambiar estado: ${response.statusText}`);
    }

    const user = await response.json();
    console.log('✅ [UsuarioService.toggleUserActive] Usuario actualizado:', user);
    return user;
  }
}

export const usuarioService = new UsuarioService();
export type { UsuarioResponseDTO, UsuarioUpdateRequestDTO };
