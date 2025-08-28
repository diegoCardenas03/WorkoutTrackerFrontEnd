import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { MusculoResponseDTO } from '../../types/musculo/MusculoResponseDTO'
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

export const fetchMuscles = createAsyncThunk(
  'muscles/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      const data = await service.getAll()
      return data as MusculoResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar músculos')
    }
  }
)

const muscleSlice = createSlice({
  name: 'muscles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
  },
})

export default muscleSlice.reducer
