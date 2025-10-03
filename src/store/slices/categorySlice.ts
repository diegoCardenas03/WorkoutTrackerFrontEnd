import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { CategoriaResponseDTO } from '../../types/categoria/CategoriaResponseDto'
import type { CategoriaRequestDTO } from '../../types/categoria/CategoriaRequestDTO'
import { CategoriaService } from '../../services/CategoriaService'

const service = new CategoriaService()

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

// Obtener todas las categorías (solo activas - para usuarios)
export const fetchCategories = createAsyncThunk<CategoriaResponseDTO[], string>(
  'categories/fetchAll',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const data = await service.getAll()
      return data
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error fetching categories') as any
    }
  }
)

// Obtener todas las categorías (incluye inactivas - para admin)
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAllAdmin',
  async (token: string, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const [data] = await Promise.all([
        service.getAllAdmin(false),
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      return data as CategoriaResponseDTO[]
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cargar categorías')
    }
  }
)

// Crear categoría
export const createCategory = createAsyncThunk(
  'categories/create',
  async ({ token, data }: { token: string; data: CategoriaRequestDTO }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const result = await service.postAdmin(data)
      return result
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al crear categoría')
    }
  }
)

// Actualizar categoría
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ token, id, data }: { token: string; id: number; data: Partial<CategoriaRequestDTO> }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const result = await service.patchAdmin(id, data)
      return result
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al actualizar categoría')
    }
  }
)

// Toggle estado activo
export const toggleCategoryActive = createAsyncThunk(
  'categories/toggleActive',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      const result = await service.toggleActiveAdmin(id)
      return result
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al cambiar estado')
    }
  }
)

// Eliminar permanentemente
export const hardDeleteCategory = createAsyncThunk(
  'categories/hardDelete',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      service.setToken(token)
      await service.hardDeleteAdmin(id)
      return id
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al eliminar')
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetCategories: (state) => {
      state.categories = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all (activas)
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
      // Fetch all (incluye inactivas - admin)
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
      // Create
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        const index = state.categories.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Toggle active
      .addCase(toggleCategoryActive.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleCategoryActive.fulfilled, (state, action) => {
        state.loading = false
        const index = state.categories.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(toggleCategoryActive.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Hard delete
      .addCase(hardDeleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload)
      })
  }
})

export const { clearError, resetCategories } = categorySlice.actions
export default categorySlice.reducer
