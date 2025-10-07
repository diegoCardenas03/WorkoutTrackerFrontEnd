import { configureStore } from '@reduxjs/toolkit'
import exerciseReducer from './slices/exerciseSlice'
import equipmentReducer from './slices/equipmentSlice'
import routineReducer from './slices/routineSlice'
import categoryReducer from './slices/categorySlice'
import trainingReducer from './slices/trainingSlice'
import agendaReducer from './slices/agendaSlice'
import muscleReducer from './slices/muscleSlice'
import muscleZoneReducer from './slices/muscleZoneSlice'
import pesoReducer from './slices/pesoSlice'
import communityReducer from './slices/communitySlice'
import comentarioReducer from './slices/comentarioSlice'



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
  peso: pesoReducer,
  community: communityReducer,
  comentarios: comentarioReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch