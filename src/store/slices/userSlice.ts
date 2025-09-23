import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsuarioService } from '../../services/UsuarioService'
import type { UsuarioResponseDTO } from '../../types/usuario/UsuarioResponseDTO'

const service = new UsuarioService()

type UserState = {
  currentUser: UsuarioResponseDTO | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
}

export const signupManual = createAsyncThunk(
  'user/signupManual',
  async (
    payload: { email: string; password: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await service.signup(payload)
      return user as UsuarioResponseDTO
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Error al registrar usuario')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null
    },
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupManual.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupManual.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(signupManual.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? 'Error'
      })
  },
})

export const { logout, clearUserError } = userSlice.actions
export default userSlice.reducer
