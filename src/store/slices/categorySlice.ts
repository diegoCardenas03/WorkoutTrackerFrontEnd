import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { CategoriaResponseDTO } from '../../types/categoria/CategoriaResponseDto'
import { CategoriaService } from '../../services/CategoriaService'

type CategoryState = {
  categories: CategoriaResponseDTO[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk<CategoriaResponseDTO[]>(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const service = new CategoriaService()
      const data = await service.getAll()
      return data
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error fetching categories') as any
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
  }
})

export default categorySlice.reducer
