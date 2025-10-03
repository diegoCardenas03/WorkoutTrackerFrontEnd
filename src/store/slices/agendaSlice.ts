import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AgendaRequestDTO } from "../../types/agenda/AgendaRequestDTO";
import type { AgendaResponseDTO } from "../../types/agenda/AgendaResponseDTO";

type AgendaState = {
  items: AgendaResponseDTO[];
  loading: boolean;
  error: string | null;
};

const initialState: AgendaState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAgenda = createAsyncThunk(
  "agenda/fetch",
  async (token: string, { rejectWithValue }) => {
    try {
      // Usar endpoint específico del usuario: GET /user/me
      const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/api/schedules/user/me`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al cargar agenda');
      }
      const data = await response.json();
      return data as AgendaResponseDTO[];
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al cargar agenda");
    }
  }
);

export const createAgendaItem = createAsyncThunk(
  "agenda/create",
  async ({ payload, token }: { payload: AgendaRequestDTO; token: string }, { rejectWithValue }) => {
    try {
      // Remover userId del payload porque el backend lo obtiene del JWT
      const { userId, ...cleanPayload } = payload;
      
      const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(cleanPayload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear agenda');
      }
      
      const data = await response.json();
      return data as AgendaResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al agendar entrenamiento");
    }
  }
);

export const deleteAgendaItem = createAsyncThunk(
  "agenda/delete",
  async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/api/schedules/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al eliminar');
      }
      return id;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al eliminar elemento de agenda");
    }
  }
);

export const markAgendaCompleted = createAsyncThunk(
  "agenda/markCompleted",
  async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/api/schedules/${id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al marcar como completada');
      }
      const data = await response.json();
      return data as AgendaResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al marcar como completada");
    }
  }
);

export const updateAgendaItem = createAsyncThunk(
  "agenda/update",
  async (
    { id, changes, token }: { id: number; changes: Partial<AgendaRequestDTO> & Record<string, any>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/api/schedules/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar');
      }
      const data = await response.json();
      return data as AgendaResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al actualizar agenda");
    }
  }
);

const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgenda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgenda.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as AgendaResponseDTO[];
      })
      .addCase(fetchAgenda.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error";
      })
      .addCase(createAgendaItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgendaItem.fulfilled, (state, action) => {
        state.loading = false;
        // optimistic add; backend might return minimal string in current BackendClient.post, so push only if shaped
        const item = action.payload as AgendaResponseDTO;
        if (item && typeof item === "object" && "id" in item) {
          state.items.push(item);
        }
      })
      .addCase(createAgendaItem.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error";
      })
      .addCase(deleteAgendaItem.fulfilled, (state, action) => {
        const id = action.payload as number;
        state.items = state.items.filter((i) => i.id !== id);
      })
      .addCase(markAgendaCompleted.fulfilled, (state, action) => {
        const updated = action.payload as AgendaResponseDTO;
        state.items = state.items.map((i) => (i.id === updated.id ? updated : i));
      })
      .addCase(updateAgendaItem.fulfilled, (state, action) => {
        const updated = action.payload as AgendaResponseDTO;
        state.items = state.items.map((i) => (i.id === updated.id ? updated : i));
      })
  },
});

export default agendaSlice.reducer;
