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
 * Dar like a una rutina (toggle)
 * POST /api/routines/{id}/like o /api/routines/{id}/unlike
 */
export const likeRoutine = createAsyncThunk(
  "community/likeRoutine",
  async ({ token, routineId, isLiked }: { token: string; routineId: number; isLiked: boolean }, { rejectWithValue }) => {
    try {
      if (isLiked) {
        // Si ya tiene like, quitar like
        await rutinaService.unlikeRoutine(token, routineId);
      } else {
        // Si no tiene like, dar like
        await rutinaService.likeRoutine(token, routineId);
      }
      
      return { routineId, isLiked: !isLiked };
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al dar like");
    }
  }
);

/**
 * Marcar/desmarcar rutina como guardada (toggle)
 * POST /api/routines/{id}/save o /api/routines/{id}/unsave
 */
export const savePublicRoutine = createAsyncThunk(
  "community/saveRoutine",
  async ({ token, routineId, isSaved }: { token: string; routineId: number; isSaved: boolean }, { rejectWithValue }) => {
    try {
      if (isSaved) {
        // Si ya está guardada, quitarla de guardadas
        await rutinaService.unsaveRoutine(token, routineId);
      } else {
        // Si no está guardada, guardarla
        await rutinaService.saveRoutine(token, routineId);
      }
      
      return { routineId, isSaved: !isSaved };
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

    // Like rutina
    builder
      .addCase(likeRoutine.fulfilled, (state, action) => {
        const routine = state.routines.find((r) => r.id === action.payload.routineId);
        if (routine) {
          // Toggle: incrementar o decrementar
          if (action.payload.isLiked) {
            routine.likesCount = (routine.likesCount || 0) + 1;
          } else {
            routine.likesCount = Math.max(0, (routine.likesCount || 0) - 1);
          }
        }
      });

    // Save rutina
    builder
      .addCase(savePublicRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePublicRoutine.fulfilled, (state) => {
        state.loading = false;
        // No necesitamos actualizar nada aquí, el estado local en CommunityView lo maneja
      })
      .addCase(savePublicRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateStats } = communitySlice.actions;
export default communitySlice.reducer;
