import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AgendaRequestDTO } from "../../types/agenda/AgendaRequestDTO";
import type { AgendaResponseDTO } from "../../types/agenda/AgendaResponseDTO";
import { AgendaService } from "../../services/AgendaService";

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

const service = new AgendaService();

export const fetchAgenda = createAsyncThunk(
  "agenda/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      // Temporary: fetch agendas only for user id 1 until auth is implemented
      const data = await service.getByUser(1);
      return data as AgendaResponseDTO[];
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al cargar agenda");
    }
  }
);

export const createAgendaItem = createAsyncThunk(
  "agenda/create",
  async (payload: AgendaRequestDTO, { rejectWithValue }) => {
    try {
      const data = await service.post(payload);
      return data as unknown as AgendaResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al agendar entrenamiento");
    }
  }
);

export const deleteAgendaItem = createAsyncThunk(
  "agenda/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await service.delete(id);
      return id;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al eliminar elemento de agenda");
    }
  }
);

export const markAgendaCompleted = createAsyncThunk(
  "agenda/markCompleted",
  async (id: number, { rejectWithValue }) => {
    try {
  // Usar endpoint específico del backend para completar
  const data = await service.complete(id);
      return data as AgendaResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al marcar como completada");
    }
  }
);

export const updateAgendaItem = createAsyncThunk(
  "agenda/update",
  async (
    { id, changes }: { id: number; changes: Partial<AgendaRequestDTO> & Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const data = await service.patch(id, changes as any);
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
