import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { comentarioService, type ComentarioRequestDTO, type ComentarioContentRequestDTO } from "../../services/ComentarioService";
import type { ComentarioResponseDTO } from "../../types/comentario/ComentarioResponseDTO";

interface ComentarioState {
  comments: ComentarioResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: ComentarioState = {
  comments: [],
  loading: false,
  error: null,
};

/**
 * Obtener comentarios de una rutina
 */
export const fetchComentariosByRoutine = createAsyncThunk(
  "comentarios/fetchByRoutine",
  async ({ token, routineId }: { token: string; routineId: number }, { rejectWithValue }) => {
    try {
      const data = await comentarioService.getComentariosByRoutineId(token, routineId);
      return data as ComentarioResponseDTO[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al cargar comentarios");
    }
  }
);

/**
 * Crear comentario o respuesta
 */
export const createComentario = createAsyncThunk(
  "comentarios/create",
  async ({ token, dto }: { token: string; dto: ComentarioRequestDTO }, { rejectWithValue }) => {
    try {
      const data = await comentarioService.createComentario(token, dto);
      return data as ComentarioResponseDTO;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al crear comentario");
    }
  }
);

/**
 * Actualizar contenido de comentario
 */
export const updateComentarioContent = createAsyncThunk(
  "comentarios/update",
  async (
    { token, id, dto }: { token: string; id: number; dto: ComentarioContentRequestDTO },
    { rejectWithValue }
  ) => {
    try {
      const data = await comentarioService.updateComentarioContent(token, id, dto);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al actualizar comentario");
    }
  }
);

/**
 * Dar/quitar like a un comentario
 */
export const toggleLikeComentario = createAsyncThunk(
  "comentarios/toggleLike",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const data = await comentarioService.toggleLikeComentario(token, id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al dar like al comentario");
    }
  }
);

/**
 * Eliminar propio comentario
 */
export const deleteOwnComentario = createAsyncThunk(
  "comentarios/deleteOwn",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      await comentarioService.deleteOwnComentario(token, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al eliminar comentario");
    }
  }
);

/**
 * Eliminar comentario (admin)
 */
export const deleteComentarioAdmin = createAsyncThunk(
  "comentarios/deleteAdmin",
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      await comentarioService.deleteComentarioAdmin(token, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al eliminar comentario");
    }
  }
);

const comentarioSlice = createSlice({
  name: "comentarios",
  initialState,
  reducers: {
    clearComentarios: (state) => {
      state.comments = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch comentarios por rutina
    builder
      .addCase(fetchComentariosByRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComentariosByRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComentariosByRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Crear comentario
    builder
      .addCase(createComentario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComentario.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComentario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Actualizar comentario
    builder
      .addCase(updateComentarioContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComentarioContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = { ...state.comments[index], ...action.payload };
        }
      })
      .addCase(updateComentarioContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle like en comentario
    builder
      .addCase(toggleLikeComentario.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLikeComentario.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = { ...state.comments[index], ...action.payload };
        }
      })
      .addCase(toggleLikeComentario.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Eliminar propio comentario
    builder
      .addCase(deleteOwnComentario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOwnComentario.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteOwnComentario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Eliminar comentario (admin)
    builder
      .addCase(deleteComentarioAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComentarioAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteComentarioAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearComentarios, clearError } = comentarioSlice.actions;
export default comentarioSlice.reducer;
