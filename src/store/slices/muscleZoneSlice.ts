import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { ZonaMuscularResponseDTO } from '../../types/zonaMuscular/ZonaMuscularResponseDTO'
import type { ZonaMuscularRequestDTO } from '../../types/zonaMuscular/ZonaMuscularRequestDTO'
import { ZonaMuscularService } from '../../services/ZonaMuscularService'

const service = new ZonaMuscularService()

interface MuscleZoneState {
  muscleZones: ZonaMuscularResponseDTO[]
  loading: boolean
  error: string | null
}

const initialState: MuscleZoneState = {
  muscleZones: [],
  loading: false,
  error: null,
}

// Obtener todas las zonas musculares (admin - incluye inactivas)
export const fetchMuscleZones = createAsyncThunk(
  'muscleZones/fetchAll',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      // Delay mínimo para mejor UX del spinner
      const [data] = await Promise.all([
        service.getAllAdmin(true), // relations=true
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data as ZonaMuscularResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar zonas musculares')
    }
  }
)

// Obtener solo zonas musculares ACTIVAS (para modals de creación)
export const fetchActiveMuscleZones = createAsyncThunk(
  'muscleZones/fetchActive',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const data = await service.getAll() // Solo activas
      return data as ZonaMuscularResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar zonas activas')
    }
  }
)

// Crear zona muscular
export const createMuscleZone = createAsyncThunk(
  'muscleZones/create',
  async ({ token, data }: { token: string; data: ZonaMuscularRequestDTO }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.postAdmin(data)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al crear zona muscular')
    }
  }
)

// Actualizar zona muscular
export const updateMuscleZone = createAsyncThunk(
  'muscleZones/update',
  async ({ token, id, data }: { token: string; id: number; data: Partial<ZonaMuscularRequestDTO> }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.patchAdmin(id, data)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al actualizar zona muscular')
    }
  }
)

// Toggle estado activo
export const toggleMuscleZoneActive = createAsyncThunk(
  'muscleZones/toggleActive',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.toggleActiveAdmin(id)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cambiar estado')
    }
  }
)

const muscleZoneSlice = createSlice({
  name: 'muscleZones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all (admin)
      .addCase(fetchMuscleZones.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMuscleZones.fulfilled, (state, action) => {
        state.loading = false
        state.muscleZones = action.payload
      })
      .addCase(fetchMuscleZones.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
      // Fetch active only (para modals)
      .addCase(fetchActiveMuscleZones.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveMuscleZones.fulfilled, (state, action) => {
        state.loading = false
        state.muscleZones = action.payload
      })
      .addCase(fetchActiveMuscleZones.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
      // Create
      .addCase(createMuscleZone.fulfilled, (state, action) => {
        state.muscleZones.push(action.payload)
      })
      // Update
      .addCase(updateMuscleZone.fulfilled, (state, action) => {
        const index = state.muscleZones.findIndex((z) => z.id === action.payload.id)
        if (index !== -1) {
          state.muscleZones[index] = action.payload
        }
      })
      // Toggle active
      .addCase(toggleMuscleZoneActive.fulfilled, (state, action) => {
        const index = state.muscleZones.findIndex((z) => z.id === action.payload.id)
        if (index !== -1) {
          state.muscleZones[index].active = action.payload.active
        }
      })
  },
})

export default muscleZoneSlice.reducer
