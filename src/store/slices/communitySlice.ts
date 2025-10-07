import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RutinaResponseDTO } from "../../types/rutina/RutinaResponseDTO";
import { RutinaService } from "../../services/RutinaService";

const API_BASE_URL = import.meta.env.VITE_API_BASEURL;
const rutinaService = new RutinaService();

interface CommunityState {
  routines: RutinaResponseDTO[];
  loading: boolean;
  error: string | null;
  stats: {
    totalRoutines: number;
    totalLikes: number;
    totalSaves: number;
    popularCategory: string;
  };
}

const initialState: CommunityState = {
  routines: [],
  loading: false,
  error: null,
  stats: {
    totalRoutines: 0,
    totalLikes: 0,
    totalSaves: 0,
    popularCategory: "—",
  },
};

/**
 * Obtener todas las rutinas públicas
 * GET /api/routines/public
 */
export const fetchPublicRoutines = createAsyncThunk(
  "community/fetchPublicRoutines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/routines/public?relations=true`);
      
      if (!response.ok) {
        throw new Error("Error al obtener rutinas públicas");
      }
      
      const data = await response.json();
      return data as RutinaResponseDTO[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al cargar rutinas públicas");
    }
  }
);

/**
 * Dar/quitar like a una rutina (toggle)
 * POST /api/routines/{id}/like
 */
export const likeRoutine = createAsyncThunk(
  "community/likeRoutine",
  async ({ token, routineId, wasLiked }: { token: string; routineId: number; wasLiked: boolean }, { rejectWithValue }) => {
    try {
      // El backend ahora maneja el toggle automáticamente
      await rutinaService.toggleLikeRoutine(token, routineId);
      
      return { routineId, wasLiked };
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al dar like");
    }
  }
);

/**
 * Guardar/quitar rutina de guardadas (toggle)
 * POST /api/routines/{id}/save
 */
export const savePublicRoutine = createAsyncThunk(
  "community/saveRoutine",
  async ({ token, routineId }: { token: string; routineId: number }, { rejectWithValue }) => {
    try {
      // El backend ahora maneja el toggle automáticamente
      await rutinaService.toggleSaveRoutine(token, routineId);
      
      return { routineId };
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al guardar rutina");
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      // Calcular estadísticas a partir de las rutinas cargadas
      state.stats.totalRoutines = state.routines.length;
      state.stats.totalLikes = state.routines.reduce((sum, r) => sum + (r.likesCount || 0), 0);
      
      // Categoría más popular
      const categoryCount: Record<string, number> = {};
      state.routines.forEach((r) => {
        const cat = r.category?.name || "Sin categoría";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      const popularCat = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0];
      
      state.stats.popularCategory = popularCat ? popularCat[0] : "—";
    },
  },
  extraReducers: (builder) => {
    // Fetch rutinas públicas
    builder
      .addCase(fetchPublicRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicRoutines.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = action.payload;
      })
      .addCase(fetchPublicRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Like rutina - Actualizar contador optimistamente
    builder
      .addCase(likeRoutine.pending, (state, action) => {
        // Actualización optimista del contador
        const routine = state.routines.find((r) => r.id === action.meta.arg.routineId);
        if (routine) {
          const wasLiked = action.meta.arg.wasLiked;
          // Si ya tenía like, decrementar. Si no tenía like, incrementar
          if (wasLiked) {
            routine.likesCount = Math.max(0, (routine.likesCount || 0) - 1);
          } else {
            routine.likesCount = (routine.likesCount || 0) + 1;
          }
        }
      })
      .addCase(likeRoutine.fulfilled, () => {
        // El contador ya está actualizado optimistamente en pending
      })
      .addCase(likeRoutine.rejected, (state, action) => {
        // Revertir el cambio optimista si falla
        const routine = state.routines.find((r) => r.id === action.meta.arg.routineId);
        if (routine) {
          const wasLiked = action.meta.arg.wasLiked;
          // Revertir: si tenía like, volver a incrementar. Si no tenía, volver a decrementar
          if (wasLiked) {
            routine.likesCount = (routine.likesCount || 0) + 1;
          } else {
            routine.likesCount = Math.max(0, (routine.likesCount || 0) - 1);
          }
        }
      });

    // Save rutina
    builder
      .addCase(savePublicRoutine.fulfilled, () => {
        // Actualización optimista manejada en el componente
      });
  },
});

export const { clearError, updateStats } = communitySlice.actions;
export default communitySlice.reducer;
