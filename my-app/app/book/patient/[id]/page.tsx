"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/ReduxStore/hooks"
import { fetchDoctors } from "@/ReduxSlices/doctorSlice"
import { addAppointment } from "@/ReduxSlices/appointmentSlice"

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const doctorId = parseInt(params.id as string)
  const { doctors } = useAppSelector((state) => state.doctors)
  console.log("Doctors from Redux:", doctors)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [phone, setPhone] = useState("")
  const [relationship, setRelationship] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors())
    }
  }, [dispatch, doctors.length])

  const doctor = doctors?.find((doc) => doc.id === doctorId)

  const handleConfirmBooking = () => {
    setError("")

    // make sure a doctor is selected (TypeScript guard)
    if (!doctor) {
      setError("Doctor information not available")
      return
    }

    if (!name || !age || !phone || !relationship || !reason) {
      setError("All fields are required")
      return
    }

    const tempBooking = JSON.parse(
      localStorage.getItem("tempBooking") || "{}"
    )

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    )

  

    // const newBooking = {
    //   id: Date.now(),
    //   doctorId,
    //   doctorName: doctor?.name,
    //   userId: currentUser.id,
    //   date: tempBooking.selectedDate,
    //   slot: tempBooking.selectedSlot,
    //   patientName: name,
    //   age,
    //   phone,
    //   relationship,
    //   reason,
    // }

    // localStorage.setItem(
    //   "appointments",
    //   JSON.stringify([...existingBookings, newBooking])
    // )

    // localStorage.removeItem("tempBooking")
 const newBooking = {
  id: Date.now(),
  doctorId,
  doctorName: doctor.name, // ✅ fixed
  userId: Number(currentUser.id), // ✅ ensure number
  date: String(tempBooking.selectedDate), // ✅ ensure string
  slot: String(tempBooking.selectedSlot), // ✅ ensure string
  patientName: name,
  age,
  phone,
  relationship,
  reason,
  status: "upcoming" as const, // ✅ important
}

dispatch(addAppointment(newBooking))

    router.push("/book/user")
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24">
      <div className="max-w-2xl mx-auto">

        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl">
            <CardTitle className="text-center text-2xl">
              Enter Patient Details
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-5">

            <Input
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              placeholder="Relationship with Patient"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            />

            <Input
              placeholder="Reason for Consultation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              onClick={handleConfirmBooking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
            >
              Confirm Booking
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}