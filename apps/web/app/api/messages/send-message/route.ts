import { prisma } from "@repo/db"

export async function POST(request: Request) {
  console.log(request)
  return Response.json({
    message: "Hello World from POST"
  })
}

export async function GET(request: Request) {
  const data = await prisma.autoreply.findMany()
  return Response.json({
    "data": data
  })
}
