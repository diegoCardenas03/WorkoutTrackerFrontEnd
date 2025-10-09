import { useState, useRef } from 'react';
import { LuUser, LuX, LuCamera } from 'react-icons/lu';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string, profileImage?: File) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export const UsernameModal = ({ isOpen, onSubmit, onSkip, isLoading = false }: UsernameModalProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede superar los 5MB');
        return;
      }

      setProfileImage(file);
      setError('');

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!username.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (username.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (username.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres');
      return;
    }

    // Solo letras, números, espacios, acentos y apóstrofes
    const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s'.-]+$/;
    if (!nameRegex.test(username)) {
      setError('El nombre solo puede contener letras, números, espacios y caracteres válidos');
      return;
    }

    setError('');
    onSubmit(username.trim(), profileImage || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-primary border border-white/10 rounded-xl shadow-2xl w-[90%] max-w-md p-6 md:p-8 relative animate-fadeIn">
        {/* Botón de saltar (cerrar) */}
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Saltar este paso"
        >
          <LuX size={24} />
        </button>

        {/* Ícono y título */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenido a WorkoutTracker
          </h2>
          <p className="text-quaternary text-sm">
            Personaliza tu perfil
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-tertiary border-2 border-white/20">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LuUser className="text-quaternary" size={40} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="absolute bottom-0 right-0 p-2 bg-white text-primary rounded-full hover:bg-white/90 transition-colors disabled:opacity-50 border-2 border-primary"
              >
                <LuCamera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-quaternary text-xs mt-2">
              {profileImage ? profileImage.name : 'Foto de perfil (opcional)'}
            </p>
          </div>

          <div>
            <label htmlFor="username" className="block text-white font-light mb-2">
              Tu nombre
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Juan Pérez"
              disabled={isLoading}
              className="w-full h-11 px-4 text-[15px] rounded-[5px] text-white placeholder-gray-500 border border-white/30 focus:border-quaternary focus:outline-none transition-colors bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              2-50 caracteres. Puedes usar tu nombre completo.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 px-6 rounded-lg bg-white text-primary font-bold hover:bg-white/90 transition-colors flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {!isLoading && <LuUser size={20} />}
              {isLoading ? 'Guardando...' : 'Guardar perfil'}
            </button>

            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="text-quaternary hover:text-white text-sm underline transition-colors disabled:opacity-50"
            >
              Saltar este paso (puedes configurarlo después)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
