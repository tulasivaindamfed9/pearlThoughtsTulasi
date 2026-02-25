import doctorSlice from "@/ReduxSlices/doctorSlice"
import { configureStore } from "@reduxjs/toolkit"
import appointmentReducer from "@/ReduxSlices/appointmentSlice"

const store = configureStore({
  reducer: {
    doctors: doctorSlice,
    appointments: appointmentReducer, 
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch