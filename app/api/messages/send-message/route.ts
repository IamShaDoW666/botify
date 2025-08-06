export async function POST(request: Request) {
  console.log(request)
  return Response.json({
    message: "Hello World from POST"
  })
}
