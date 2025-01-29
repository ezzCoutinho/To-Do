import { auth } from "@/lib/auth";

console.log("Better Auth API is initialized:", auth);
// Passamos os métodos GET e POST do Better Auth

export async function POST(request: Request) {
  return auth.handler(request);
}

export async function GET(request: Request) {
  return auth.handler(request);
}
