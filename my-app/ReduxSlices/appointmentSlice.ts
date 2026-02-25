import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

export interface Appointment {
  id: number
  doctorId: number
  doctorName: string
  userId: number
  date: string
  slot: string
  patientName: string
  age: string
  phone: string
  relationship: string
  reason: string
  status: "upcoming" | "completed" | "cancelled"
}

interface AppointmentState {
  list: Appointment[]
}

const initialState: AppointmentState = {
  list: [],
}

export const fetchAppointments = createAsyncThunk<
  Appointment[]
>("appointments/fetch", async () => {
  const data = JSON.parse(
    localStorage.getItem("appointments") || "[]"
  )
  return data
})

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (
      state,
      action: PayloadAction<Appointment>
    ) => {
      state.list.push(action.payload)

      localStorage.setItem(
        "appointments",
        JSON.stringify(state.list)
      )
    },

    updateAppointment: (
      state,
      action: PayloadAction<Appointment>
    ) => {
      state.list = state.list.map((a) =>
        a.id === action.payload.id
          ? action.payload
          : a
      )

      localStorage.setItem(
        "appointments",
        JSON.stringify(state.list)
      )
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchAppointments.fulfilled,
      (state, action) => {
        state.list = action.payload
      }
    )
  },
})

export const { addAppointment, updateAppointment } =
  appointmentSlice.actions

export default appointmentSlice.reducer