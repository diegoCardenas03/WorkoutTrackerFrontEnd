import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
      // console.log('📊 [equipmentSlice] Fetching equipments con token...')
      equipamientoService.setToken(token)
      // Delay mínimo para mejor UX del spinner
      const [data] = await Promise.all([
        equipamientoService.getAllAdmin(false), // sin relations
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al traer equipamientos:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

// Obtener solo equipamientos ACTIVOS (para modals de creación)
export const fetchActiveEquipments = createAsyncThunk(
  'equipments/fetchActive',
  async (token: string, { rejectWithValue }) => {
    try {
      // console.log('📊 [equipmentSlice] Fetching active equipments...')
      equipamientoService.setToken(token)
      const data = await equipamientoService.getAll() // Solo activos
      return data
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al traer equipamientos activos:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

// Crear equipamiento
export const createEquipment = createAsyncThunk(
  'equipments/create',
  async ({ token, data, image }: { token: string; data: EquipamientoRequestDTO; image?: File }, { rejectWithValue }) => {
    try {
      // console.log('🚀 [equipmentSlice] Creando equipamiento...')
      const result = await equipamientoService.createEquipment(token, data, image)
      return result
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al crear equipamiento:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear equipamiento')
    }
  }
)

// Actualizar equipamiento
export const updateEquipment = createAsyncThunk(
  'equipments/update',
  async ({ token, id, data, image }: { token: string; id: number; data: Partial<EquipamientoRequestDTO>; image?: File }, { rejectWithValue }) => {
    try {
      // console.log('🔄 [equipmentSlice] Actualizando equipamiento:', id)
      const result = await equipamientoService.updateEquipment(token, id, data as EquipamientoRequestDTO, image)
      return result
    } catch (error) {
      console.error("❌ [equipmentSlice] Error al actualizar equipamiento:", error)
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar equipamiento')
    }
  }
)

// Toggle estado activo/inactivo
export const toggleEquipmentActive = createAsyncThunk(
  'equipments/toggleActive',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      // console.log('🔄 [equipmentSlice] Toggle equipamiento:', id)
      equipamientoService.setToken(token)
      const result = await equipamientoService.toggleActiveAdmin(id)
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
      equipamientoService.setToken(token)
      const result = await equipamientoService.deactivateAdmin(id)
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
      equipamientoService.setToken(token)
      await equipamientoService.hardDeleteAdmin(id)
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
      // Fetch all equipments (admin)
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
      // Fetch active only (para modals)
      .addCase(fetchActiveEquipments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveEquipments.fulfilled, (state, action) => {
        state.loading = false
        state.equipments = action.payload
      })
      .addCase(fetchActiveEquipments.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
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
      // Update equipment
      .addCase(updateEquipment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false
        const index = state.equipments.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.equipments[index] = action.payload
        }
      })
      .addCase(updateEquipment.rejected, (state, action) => {
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