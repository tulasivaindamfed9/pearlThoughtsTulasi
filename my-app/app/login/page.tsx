"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FiEye, FiEyeOff } from "react-icons/fi"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [loginType, setLoginType] = useState<"email" | "mobile">("email")
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobile, setMobile] = useState("")

  const [errors, setErrors] = useState<any>({})

  const validateEmailLogin = () => {
    const newErrors: any = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateMobileLogin = () => {
    const newErrors: any = {}

    const mobileRegex = /^[6-9]\d{9}$/

    if (!mobile) {
      newErrors.mobile = "Mobile number is required"
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailLogin = () => {
    if (!validateEmailLogin()) return

    const usersStr = localStorage.getItem("users")
    if (!usersStr) {
      setErrors({ email: "No users found. Please sign up." })
      return
    }

    const users = JSON.parse(usersStr)
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      setErrors({ email: "Email not registered" })
      return
    }

    if (user.password !== password) {
      setErrors({ password: "Incorrect password" })
      return
    }

    localStorage.setItem("currentUser", JSON.stringify(user))
    router.push("/doctorsList")
  }

  const handleMobileLogin = () => {
    if (!validateMobileLogin()) return

    localStorage.setItem("otpMobile", mobile)
    localStorage.setItem("generatedOTP", "1234")

    router.push("/otp")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">

          {/* Toggle */}
          <div className="flex bg-blue-100 rounded-xl p-1">
            <button
              onClick={() => {
                setLoginType("email")
                setErrors({})
              }}
              className={`w-1/2 py-2 rounded-lg font-medium ${
                loginType === "email"
                  ? "bg-blue-600 text-white"
                  : "text-blue-700"
              }`}
            >
              Email
            </button>

            <button
              onClick={() => {
                setLoginType("mobile")
                setErrors({})
              }}
              className={`w-1/2 py-2 rounded-lg font-medium ${
                loginType === "mobile"
                  ? "bg-blue-600 text-white"
                  : "text-blue-700"
              }`}
            >
              Mobile
            </button>
          </div>

          {/* EMAIL LOGIN */}
          {loginType === "email" && (
            <>
              <div>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${
                    errors.email ? "border-red-500 focus-visible:ring-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${
                      errors.password ? "border-red-500 focus-visible:ring-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                onClick={handleEmailLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </>
          )}

          {/* MOBILE LOGIN */}
          {loginType === "mobile" && (
            <>
              <div>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`${
                    errors.mobile ? "border-red-500 focus-visible:ring-red-400" : ""
                  }`}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <Button
                onClick={handleMobileLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send OTP
              </Button>
            </>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}