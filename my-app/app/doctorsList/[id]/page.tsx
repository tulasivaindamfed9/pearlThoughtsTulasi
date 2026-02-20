"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import { fetchDoctors } from "@/ReduxSlices/doctorSlice"

export default function SingleDocDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { doctors, loading } = useAppSelector(
    (state) => state.doctors
  )
console.log(doctors,"doclist from api")
  // Fetch doctors only if not already loaded
  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors())
    }
  }, [dispatch, doctors.length])

  const doctor = doctors.find(
    (doc) => doc.id === parseInt(params.id as string)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Doctor not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-6">
      <div className="
  w-full 
  max-w-sm 
  sm:max-w-md 
  md:max-w-2xl 
  lg:max-w-4xl 
  h-[90vh] 
  flex 
  flex-col 
  relative
">


        {/* Top Section */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Doctor Card */}
        <Card className="w-full py-3 bg-emerald-600 text-dark-100 rounded-xl mb-4">
          <CardContent className="p-4 flex flex-col gap-4">

            <div className="flex gap-4">

              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {doctor.name}
                </h2>

                <p>{doctor.specialty}</p>

                <p>{doctor.qualification}</p>

                <p>{doctor.fellowship}</p>
              </div>

              <Avatar className="h-20 w-20">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
            </div>

          </CardContent>
        </Card>
<div className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-300 p-4">
        {/* Stats Section */}
        <div className="grid grid-cols-4 text-center mb-6 gap-1">
        
           <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-200 p-4">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{doctor.patients}</p>
              <p>Patients</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-200 p-4">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{doctor.experience}</p> 
                <p>Years Exp.</p>
            </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-200 p-4">
            <CardContent className="p-4">
                <p className="text-2xl font-bold">{doctor.rating}</p>
                <p>Rating</p>
            </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-200 p-4">
            <CardContent className="p-4">
                <p className="text-2xl font-bold">{doctor.reviews}</p>
                <p>Reviews</p>
            </CardContent>
            </Card>
        </div>

        {/* About Doctor */}
        <div className="mb-6">
          <h3 className="text-emerald-700 font-semibold">About Doctor</h3>
          <p>{doctor.description}</p>
        </div>

        {/* Service & Specialization */}
        <div className="mb-6">
          <h3 className="text-emerald-700 font-semibold">Service & Specialization</h3>

          <div className="flex justify-between">
            <span >Service</span>
            <span>{doctor.service}</span>
          </div>

          <div className="flex justify-between">
            <span>Specialization</span>
            <span>{doctor.specialty}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-emerald-700 font-semibold">Availability For Consulting</h3>

          <div className="flex justify-between">
            <span>{doctor.availabilityDays}</span>
            <span>{doctor.availabilityTime}</span>
          </div>
        </div>
</div>
        {/* Button */}
        <button className="w-full py-3 bg-emerald-600 text-white rounded-xl">
          Book appointment
        </button>

      </div>
    </div>
  )
}