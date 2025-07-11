import { NextResponse } from "next/server" // if using app/ directory
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.set("token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  })

  return NextResponse.json({ message: "Logged out" })
}
