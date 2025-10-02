import { configureStore } from '@reduxjs/toolkit'
import exerciseReducer from './slices/exerciseSlice'
import equipmentReducer from './slices/equipmentSlice'
import routineReducer from './slices/routineSlice'
import categoryReducer from './slices/categorySlice'
import trainingReducer from './slices/trainingSlice'
import agendaReducer from './slices/agendaSlice'
import muscleReducer from './slices/muscleSlice'
import muscleZoneReducer from './slices/muscleZoneSlice'



export const store = configureStore({
  reducer: {
    exercises: exerciseReducer,
    equipments: equipmentReducer,
    routines: routineReducer,
    categories: categoryReducer,
  training: trainingReducer,
  agenda: agendaReducer,
  muscles: muscleReducer,
  muscleZones: muscleZoneReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch