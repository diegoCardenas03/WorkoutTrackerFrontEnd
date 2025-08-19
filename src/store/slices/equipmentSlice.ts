import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { EquipamientoService } from '../../services/EquipamientoService'
import type { EquipamientoResponseDTO } from '../../types/equipamiento/EquipamientoResponseDTO'

const equipamientoService = new EquipamientoService()

interface EquipmentState {
  equipments: EquipamientoResponseDTO[]
  loading: boolean
  error: string | null
}

const initialState: EquipmentState = {
  equipments: [],
  loading: false,
  error: null,
}

export const fetchEquipments = createAsyncThunk(
  'exercises/fetchEquipments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await equipamientoService.getAll()
      return data as EquipamientoResponseDTO[]
    } catch (error) {
      console.error("Error al traer ejercicios:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

export const fetchEquipmentById = createAsyncThunk(
  'exercises/fetchEquipmentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await equipamientoService.getById(id)
      return data as EquipamientoResponseDTO
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

const equipmentSlice = createSlice({
  name: 'equipments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetExercises: (state) => {
      state.equipments = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false
        state.equipments = action.payload
      })
      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchEquipmentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(fetchEquipmentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, resetExercises } = equipmentSlice.actions
export default equipmentSlice.reducer;