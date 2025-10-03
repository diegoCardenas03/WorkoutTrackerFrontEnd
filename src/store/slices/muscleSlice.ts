import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { MusculoResponseDTO } from '../../types/musculo/MusculoResponseDTO'
import type { MusculoRequestDTO } from '../../types/musculo/MusculoRequestDTO'
import { MusculoService } from '../../services/MusculoService'

const service = new MusculoService()

interface MuscleState {
  muscles: MusculoResponseDTO[]
  loading: boolean
  error: string | null
}

const initialState: MuscleState = {
  muscles: [],
  loading: false,
  error: null,
}

// Obtener todos los músculos (admin - incluye inactivos)
export const fetchMuscles = createAsyncThunk(
  'muscles/fetchAll',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      // Delay mínimo para mejor UX del spinner
      const [data] = await Promise.all([
        service.getAllAdmin(true), // relations=true para obtener muscleGroup
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data as MusculoResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar músculos')
    }
  }
)

// Obtener solo músculos ACTIVOS (para modals de creación)
export const fetchActiveMuscles = createAsyncThunk(
  'muscles/fetchActive',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const data = await service.getAll() // Solo activos
      return data as MusculoResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar músculos activos')
    }
  }
)


// Crear músculo
export const createMuscle = createAsyncThunk(
  'muscles/create',
  async ({ token, data }: { token: string; data: MusculoRequestDTO }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.postAdmin(data)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al crear músculo')
    }
  }
)

// Actualizar músculo
export const updateMuscle = createAsyncThunk(
  'muscles/update',
  async ({ token, id, data }: { token: string; id: number; data: Partial<MusculoRequestDTO> }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.patchAdmin(id, data)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al actualizar músculo')
    }
  }
)

// Toggle estado activo
export const toggleMuscleActive = createAsyncThunk(
  'muscles/toggleActive',
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

// Obtener músculo por ID
export const fetchMuscleById = createAsyncThunk(
  'muscles/fetchById',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const response = await service.getByIdAdmin(id, true)
      return response
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al obtener músculo')
    }
  }
)

const muscleSlice = createSlice({
  name: 'muscles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all (admin)
      .addCase(fetchMuscles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMuscles.fulfilled, (state, action) => {
        state.loading = false
        state.muscles = action.payload as MusculoResponseDTO[]
      })
      .addCase(fetchMuscles.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
      // Fetch active only (para modals)
      .addCase(fetchActiveMuscles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveMuscles.fulfilled, (state, action) => {
        state.loading = false
        state.muscles = action.payload as MusculoResponseDTO[]
      })
      .addCase(fetchActiveMuscles.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
      // Create
      .addCase(createMuscle.fulfilled, (state, action) => {
        state.muscles.push(action.payload)
      })
      // Update
      .addCase(updateMuscle.fulfilled, (state, action) => {
        const index = state.muscles.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.muscles[index] = action.payload
        }
      })
      // Toggle active
      .addCase(toggleMuscleActive.fulfilled, (state, action) => {
        const index = state.muscles.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.muscles[index].active = action.payload.active
        }
      })
  },
})

export default muscleSlice.reducer
