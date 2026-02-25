"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const pathname = usePathname()
  const linkStyle = (path: string) =>
  `px-4 py-2 rounded-xl transition ${
    pathname === path
      ? "bg-blue-600 text-white"
      : "text-blue-900 hover:bg-blue-100"
  }`
  
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("currentUser")
      setIsLoggedIn(!!user)
    }

    // Check on mount
    checkLoginStatus()

    // Listen for changes from other tabs
    window.addEventListener("storage", checkLoginStatus)

    // 👇 Fix for same-tab login (OTP or Email)
    window.addEventListener("focus", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("focus", checkLoginStatus)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setIsOpen(false)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/doclogo.png"
              alt="Hospital Logo"
              width={60}
              height={60}
              priority
            />
            <span className="text-2xl font-bold text-blue-700">
              MediCare+
            </span>
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-lg font-medium">

            {/* <Link href="/" className="text-blue-900 hover:text-blue-600">
              Home
            </Link> */}

            {isLoggedIn && (
              <Link
                href="/doctorsList"
                className={linkStyle("/doctorsList")}
              >
                Doctors
              </Link>
            )}

            {isLoggedIn && (
              <Link
                href="/book/user"
                className={linkStyle("/book/user")}
              >
                My Appointments
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-blue-900 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className={linkStyle("/signout")}
              >
                Sign Out
              </button>
            )}

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-4 border-t border-blue-100 text-lg font-medium">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-blue-900 hover:text-blue-600"
            >
              Home
            </Link>

            {isLoggedIn && (
              <Link
                href="/doctorsList"
                onClick={() => setIsOpen(false)}
                className="block text-blue-900 hover:text-blue-600"
              >
                Doctors
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-blue-900 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block bg-blue-600 text-white px-4 py-2 rounded-xl text-center hover:bg-blue-700 shadow-md transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}