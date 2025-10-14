export interface UsuarioStatsDTO {
  id: number;
  name: string;
  email: string;
  picture?: string;
  completedWorkouts: number;
  createdRoutines: number;
  likedRoutines: number;
  savedRoutines: number;
  completedRoutines: number;
  favoriteExercises: number;
  
}