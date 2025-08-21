import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RutinaRequestDTO } from '../../types/rutina/RutinaRequestDTO'
import type { RutinaResponseDTO } from '../../types/rutina/RutinaResponseDTO'
import { RutinaService } from '../../services/RutinaService'

const rutinaService = new RutinaService()

interface RoutineState {
  routines: RutinaResponseDTO[]
  loading: boolean
  error: string | null
  selectedRoutine: RutinaResponseDTO | null
  creating: boolean
  updating: boolean
  deleting: boolean
}

const initialState: RoutineState = {
  routines: [],
  loading: false,
  error: null,
  selectedRoutine: null,
  creating: false,
  updating: false,
  deleting: false,
}

// Async thunks
export const fetchRoutines = createAsyncThunk(
  'routines/fetchRoutines',
  async (_, { rejectWithValue }) => {
    try {
      const data = await rutinaService.getAll()
      return data as RutinaResponseDTO[]
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar rutinas')
    }
  }
)

export const fetchRoutineById = createAsyncThunk(
  'routines/fetchRoutineById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await rutinaService.getById(id)
      return data as RutinaResponseDTO
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar rutina')
    }
  }
)

export const createRoutine = createAsyncThunk(
  'routines/createRoutine',
  async (routineData: RutinaRequestDTO, { rejectWithValue }) => {
    try {
      const data = await rutinaService.post(routineData)
      return data as RutinaResponseDTO
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear rutina')
    }
  }
)

export const updateRoutine = createAsyncThunk(
  'routines/updateRoutine',
  async ({ id, routineData }: { id: number; routineData: RutinaRequestDTO }, { rejectWithValue }) => {
    try {
      const data = await rutinaService.put(id, routineData)
      return data as RutinaResponseDTO
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar rutina')
    }
  }
)

export const deleteRoutine = createAsyncThunk(
  'routines/deleteRoutine',
  async (id: number, { rejectWithValue }) => {
    try {
      await rutinaService.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar rutina')
    }
  }
)

const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    setSelectedRoutine: (state, action: PayloadAction<RutinaResponseDTO | null>) => {
      state.selectedRoutine = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetRoutines: (state) => {
      state.routines = []
      state.selectedRoutine = null
      state.error = null
    },
    addRoutineToList: (state, action: PayloadAction<RutinaResponseDTO>) => {
      state.routines.push(action.payload)
    },
    updateRoutineInList: (state, action: PayloadAction<RutinaResponseDTO>) => {
      const index = state.routines.findIndex(routine => routine.id === action.payload.id)
      if (index !== -1) {
        state.routines[index] = action.payload
      }
    },
    removeRoutineFromList: (state, action: PayloadAction<number>) => {
      state.routines = state.routines.filter(routine => routine.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all routines
      .addCase(fetchRoutines.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.loading = false
        state.routines = action.payload
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch routine by ID
      .addCase(fetchRoutineById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoutineById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedRoutine = action.payload
      })
      .addCase(fetchRoutineById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create routine
      .addCase(createRoutine.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.creating = false
        state.routines.push(action.payload)
        state.selectedRoutine = action.payload
      })
      .addCase(createRoutine.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload as string
      })
      // Update routine
      .addCase(updateRoutine.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateRoutine.fulfilled, (state, action) => {
        state.updating = false
        const index = state.routines.findIndex(routine => routine.id === action.payload.id)
        if (index !== -1) {
          state.routines[index] = action.payload
        }
        state.selectedRoutine = action.payload
      })
      .addCase(updateRoutine.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload as string
      })
      // Delete routine
      .addCase(deleteRoutine.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.deleting = false
        state.routines = state.routines.filter(routine => routine.id !== action.payload)
        if (state.selectedRoutine?.id === action.payload) {
          state.selectedRoutine = null
        }
      })
      .addCase(deleteRoutine.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSelectedRoutine,
  clearError,
  resetRoutines,
  addRoutineToList,
  updateRoutineInList,
  removeRoutineFromList,
} = routineSlice.actions

export default routineSlice.reducer