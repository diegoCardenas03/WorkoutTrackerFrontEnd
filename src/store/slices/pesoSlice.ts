import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PesoResponseDTO } from "../../types/peso/PesoResponseDTO";
import { pesoService } from "../../services/PesoService";

type PesoState = {
  weights: PesoResponseDTO[];
  lastWeight: PesoResponseDTO | null;
  loading: boolean;
  error: string | null;
};

const initialState: PesoState = {
  weights: [],
  lastWeight: null,
  loading: false,
  error: null,
};

export const fetchAllWeights = createAsyncThunk(
  "peso/fetchAll",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await pesoService.getAllBodyWeights(token);
      return data as PesoResponseDTO[];
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al cargar registros de peso");
    }
  }
);

export const fetchLastWeight = createAsyncThunk(
  "peso/fetchLast",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await pesoService.getLastBodyWeight(token);
      return data as PesoResponseDTO;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? "Error al cargar último peso");
    }
  }
);

const pesoSlice = createSlice({
  name: "peso",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all weights
      .addCase(fetchAllWeights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWeights.fulfilled, (state, action) => {
        state.loading = false;
        state.weights = action.payload as PesoResponseDTO[];
      })
      .addCase(fetchAllWeights.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error";
      })
      // Fetch last weight
      .addCase(fetchLastWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastWeight.fulfilled, (state, action) => {
        state.loading = false;
        state.lastWeight = action.payload as PesoResponseDTO;
      })
      .addCase(fetchLastWeight.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error";
      });
  },
});

export const { clearError } = pesoSlice.actions;
export default pesoSlice.reducer;
