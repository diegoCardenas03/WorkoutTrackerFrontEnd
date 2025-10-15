export interface UsuarioStatsDTO {
  id: number;
  name: string;
  email: string;
  picture?: string;
  pictureUrl?: string; // Añadido para compatibilidad con el backend
  completedWorkouts?: number; // Opcional porque no aparece en la respuesta del backend
  createdRoutines: number;
  likedRoutines: number;
  savedRoutines: number;
  completedRoutines: number;
  favoriteExercises: number;
}