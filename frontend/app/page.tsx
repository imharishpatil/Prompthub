import Hero from "@/components/homepage/hero"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CustomLayout from "@/components/layout/layout"

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <CustomLayout>
    <Hero />
    </CustomLayout>
  );
}