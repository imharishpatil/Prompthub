import Hero from "@/components/homepage/hero"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  // Check for token in cookies (server component)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <Hero />
  );
}