"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
export default function SignoutPage() {
  const router = useRouter()
    const handleSignout = () => {
        localStorage.removeItem("user")
        alert("You have been signed out.")
        router.push("/login")
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24">
            <Card className="w-full max-w-sm rounded-2xl shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
                    <CardTitle className="text-2xl text-center">Sign Out</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <p className="text-center text-gray-700">
                        Are you sure you want to sign out?
                    </p>
                    <Button
                        onClick={handleSignout}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}