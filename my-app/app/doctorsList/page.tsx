"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, CalendarDays, FileText, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import {Doctor, fetchDoctors} from "@/ReduxSlices/doctorSlice"


export default function Home() {
  const router = useRouter()
 
  const [search, setSearch] = useState("")
  const dispatch=useAppDispatch()
 

const { doctors, loading, error } = useAppSelector(
  (state) => state.doctors
)
  console.log(doctors,"doclist from api")

  useEffect(() => {
    dispatch(fetchDoctors())
  }, [])

  const filteredDoctors = doctors.filter((doc: Doctor) =>
  doc.name.toLowerCase().includes(search.toLowerCase())
)
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-4">
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

      {/* Header Card (Fixed) */}
      <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-300">
       <CardContent className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-emerald-900">
            Hello, Priya
          </h2>
         

          {/* Search */}
          <div className="relative mt-4 ">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-500 mr-2" />
            <Input
              placeholder="Search Doctors"
              className="pl-9 border border-gray-400 rounded-xl px-3 py-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-500 transition-all bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Doctor List */}
     <div className="
  flex-1 
  overflow-y-auto 
  mt-4 
  pb-24 
  grid 
  gap-4 
  grid-cols-1 
  sm:grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3
">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-200 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all"
            onClick={() => router.push(`/doctorsList/${doctor.id}`)}
          >
            <CardContent className="p-4 flex gap-4">

              <Avatar className="h-20 w-20 rounded-xl border border-gray-300">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base text-blue-900 ">
                    {doctor.name}
                  </h3>
                  <Heart className="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>

                <p className="text-xs text-cyan-700 mt-1">
                  Sr. {doctor.specialty}
                </p>

                <Badge className="bg-green-100 text-green-700 mt-1 text-xs">
                  Available today
                </Badge>

                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                  {doctor.description}
                </p>

                <p className="text-xs font-medium mt-2 text-gray-800">
                  09:30 AM - 07:00 PM
                </p>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation (Fixed) */}
      <div className="absolute bottom-0 left-0 right-0">
        <Card className="rounded-2xl shadow-xl bg-white">
          <CardContent className="flex justify-around p-3 text-xs">
            <div className="flex flex-col items-center text-cyan-600">
              <Search className="w-5 h-5 mb-1" />
              Find
            </div>
            <div className="flex flex-col items-center text-gray-500">
              <CalendarDays className="w-5 h-5 mb-1" />
              Appoint.
            </div>
            <div className="flex flex-col items-center text-gray-500">
              <FileText className="w-5 h-5 mb-1" />
              Records
            </div>
            <div className="flex flex-col items-center text-gray-500">
              <User className="w-5 h-5 mb-1" />
              Profile
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  </div>
)
}