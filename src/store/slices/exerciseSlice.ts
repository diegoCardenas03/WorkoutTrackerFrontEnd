import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EjercicioResponseDTO } from '../../types/ejercicio/EjercicioResponseDTO'
import { EjercicioService } from '../../services/EjercicioService'

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
  async (_, { rejectWithValue }) => {
    try {
      const data = await ejercicioService.getAll()
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
  },
})

export const { setSelectedExercise, clearError, resetExercises } = exerciseSlice.actions
export default exerciseSlice.reducer;