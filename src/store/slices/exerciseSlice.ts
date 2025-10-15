import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EjercicioResponseDTO } from '../../types/ejercicio/EjercicioResponseDTO'
import { EjercicioService } from '../../services/EjercicioService'
import type { EjercicioRequestDTO } from '../../types/ejercicio/EjercicioRequestDTO'

const ejercicioService = new EjercicioService()

interface ExerciseState {
  exercises: EjercicioResponseDTO[]
  loading: boolean
  error: string | null
  selectedExercise: EjercicioResponseDTO | null
}

const initialState: ExerciseState = {
  exercises: [],
  loading: false,
  error: null,
  selectedExercise: null,
}

export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async (token: string, { rejectWithValue }) => {
    try {
      ejercicioService.setToken(token)
      // Delay mínimo para mejor UX del spinner
      const [data] = await Promise.all([
        ejercicioService.getAllAdmin(true), // relations=true - ADMIN: incluye inactivos
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data as EjercicioResponseDTO[]
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

// Nueva acción para usuarios (solo ejercicios activos)
export const fetchActiveExercises = createAsyncThunk(
  'exercises/fetchActiveExercises',
  async (token: string, { rejectWithValue }) => {
    try {
      ejercicioService.setToken(token)
      // Delay mínimo para mejor UX del spinner
      const [data] = await Promise.all([
        ejercicioService.getAllActive(), // USUARIO: solo activos
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data as EjercicioResponseDTO[]
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

export const fetchExerciseById = createAsyncThunk(
  'exercises/fetchExerciseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await ejercicioService.getById(id)
      return data as EjercicioResponseDTO
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

export const createExercise = createAsyncThunk(
  'exercises/createExercise',
  async ({ token, data }: { token: string; data: EjercicioRequestDTO }, { rejectWithValue }) => {
    try {
      // console.log('🚀 [exerciseSlice] Creando ejercicio...')
      ejercicioService.setToken(token)
      const created = await ejercicioService.postAdmin(data)
      // console.log('✅ [exerciseSlice] Ejercicio creado:', created)
      return created as unknown as EjercicioResponseDTO
    } catch (error) {
      console.error('❌ [exerciseSlice] Error al crear ejercicio:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

export const updateExercise = createAsyncThunk(
  'exercises/updateExercise',
  async (
    { token, id, data }: { token: string; id: number; data: Partial<EjercicioRequestDTO> },
    { rejectWithValue }
  ) => {
    try {
      // console.log('🔄 [exerciseSlice] Actualizando ejercicio:', id)
      ejercicioService.setToken(token)
      const updated = await ejercicioService.patchAdmin(id, data)
      // console.log('✅ [exerciseSlice] Ejercicio actualizado:', updated)
      return updated as unknown as EjercicioResponseDTO
    } catch (error) {
      console.error('❌ [exerciseSlice] Error al actualizar ejercicio:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  }
)

// Toggle estado activo/inactivo
export const toggleExerciseActive = createAsyncThunk(
  'exercises/toggleActive',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      // console.log('🔄 [exerciseSlice] Toggle exercise:', id)
      ejercicioService.setToken(token)
      const result = await ejercicioService.toggleActiveAdmin(id)
      // console.log('✅ [exerciseSlice] Estado cambiado:', result)
      return result
    } catch (error) {
      console.error('❌ [exerciseSlice] Error al toggle exercise:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cambiar estado')
    }
  }
)

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setSelectedExercise: (state, action: PayloadAction<EjercicioResponseDTO | null>) => {
      state.selectedExercise = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetExercises: (state) => {
      state.exercises = []
      state.selectedExercise = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false
        state.exercises = action.payload
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch active exercises (usuarios)
      .addCase(fetchActiveExercises.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveExercises.fulfilled, (state, action) => {
        state.loading = false
        state.exercises = action.payload
      })
      .addCase(fetchActiveExercises.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedExercise = action.payload
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createExercise.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false
        const item = action.payload as EjercicioResponseDTO
        if (item && typeof item === 'object' && 'id' in item) {
          state.exercises.push(item)
        }
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateExercise.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false
        const item = action.payload as EjercicioResponseDTO
        const idx = state.exercises.findIndex(e => e.id === item.id)
        if (idx !== -1) {
          state.exercises[idx] = item
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Toggle active
      .addCase(toggleExerciseActive.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleExerciseActive.fulfilled, (state, action) => {
        state.loading = false
        const index = state.exercises.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.exercises[index].active = action.payload.active
        }
      })
      .addCase(toggleExerciseActive.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedExercise, clearError, resetExercises } = exerciseSlice.actions
export default exerciseSlice.reducer;
