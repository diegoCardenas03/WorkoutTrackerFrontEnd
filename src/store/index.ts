import { configureStore } from '@reduxjs/toolkit'
import exerciseReducer from './slices/exerciseSlice'
import equipmentReducer from './slices/equipmentSlice'
import routineReducer from './slices/routineSlice'



export const store = configureStore({
  reducer: {
    exercises: exerciseReducer,
    equipments: equipmentReducer,
    routines: routineReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch