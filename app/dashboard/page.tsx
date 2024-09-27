import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col gap-6">
        <h1>Dashboard</h1>
        <p>Welcome {session?.user?.name}!</p>
      </div>
    </div>
  );
}
