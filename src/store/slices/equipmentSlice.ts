import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import { EquipamientoService } from '../../services/EquipamientoService'
import type { EquipamientoResponseDTO } from '../../types/equipamiento/EquipamientoResponseDTO'
import type { EquipamientoRequestDTO } from '../../types/equipamiento/EquipamientoRequestDTO'

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

// Obtener todos los equipamientos (ADMIN)
export const fetchEquipments = createAsyncThunk(
  'equipments/fetchAll',
  async (token: string, { rejectWithValue }) => {
    try {
      console.log('📊 [equipmentSlice] Fetching equipments con token...')
      const data = await equipamientoService.getAllEquipments(token)
      return data
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al traer equipamientos:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

// Crear equipamiento
export const createEquipment = createAsyncThunk(
  'equipments/create',
  async ({ token, data }: { token: string; data: EquipamientoRequestDTO }, { rejectWithValue }) => {
    try {
      console.log('🚀 [equipmentSlice] Creando equipamiento...')
      const result = await equipamientoService.createEquipment(token, data)
      return result
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al crear equipamiento:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear equipamiento')
    }
  }
)

// Toggle estado activo/inactivo
export const toggleEquipmentActive = createAsyncThunk(
  'equipments/toggleActive',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      console.log('🔄 [equipmentSlice] Toggle equipamiento:', id)
      const result = await equipamientoService.toggleActive(token, id)
      return result
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al toggle equipamiento:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cambiar estado')
    }
  }
)

// Desactivar equipamiento (soft delete)
export const deactivateEquipment = createAsyncThunk(
  'equipments/deactivate',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const result = await equipamientoService.deactivateEquipment(token, id)
      return result
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al desactivar')
    }
  }
)

// Eliminar equipamiento permanentemente (hard delete)
export const hardDeleteEquipment = createAsyncThunk(
  'equipments/hardDelete',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      await equipamientoService.hardDeleteEquipment(token, id)
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar')
    }
  }
)

export const fetchEquipmentById = createAsyncThunk(
  'equipments/fetchById',
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
    resetEquipments: (state) => {
      state.equipments = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all equipments
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
      // Create equipment
      .addCase(createEquipment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.loading = false
        state.equipments.push(action.payload)
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Toggle active
      .addCase(toggleEquipmentActive.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleEquipmentActive.fulfilled, (state, action) => {
        state.loading = false
        const index = state.equipments.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.equipments[index] = action.payload
        }
      })
      .addCase(toggleEquipmentActive.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Deactivate
      .addCase(deactivateEquipment.fulfilled, (state, action) => {
        const index = state.equipments.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.equipments[index] = action.payload
        }
      })
      // Hard delete
      .addCase(hardDeleteEquipment.fulfilled, (state, action) => {
        state.equipments = state.equipments.filter(e => e.id !== action.payload)
      })
      // Fetch by ID
      .addCase(fetchEquipmentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEquipmentById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchEquipmentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, resetEquipments } = equipmentSlice.actions
export default equipmentSlice.reducer;