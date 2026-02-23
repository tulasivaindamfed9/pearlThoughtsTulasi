"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function OTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")

  const handleVerify = () => {
    const storedOTP = localStorage.getItem("generatedOTP")
    const mobile = localStorage.getItem("otpMobile")

    if (!otp) {
      setError("OTP is required")
      return
    }

    if (!/^\d{4}$/.test(otp)) {
      setError("OTP must be exactly 4 digits")
      return
    }

    if (otp !== storedOTP) {
      setError("Invalid OTP")
      return
    }

    // ✅ Create user object for mobile login
    const mobileUser = {
      id: Date.now(),
      mobile: mobile,
      loginType: "mobile",
    }

    // ✅ Store logged in user
    localStorage.setItem("currentUser", JSON.stringify(mobileUser))

    // ✅ Clean temporary OTP data
    localStorage.removeItem("generatedOTP")
    localStorage.removeItem("otpMobile")

    router.push("/doctorsList")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
          <CardTitle className="text-center text-2xl">
            Enter OTP
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Enter 4-digit OTP"
              value={otp}
              maxLength={4}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                setOtp(value)
                setError("")
              }}
              className={`${
                error ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />

            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Verify OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}