import { api } from "~/trpc/server";

export default async function Home() {
  const { status } = await api.health.getHealth.query();
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold">Zenith Form</h1>
        <p className="text-muted-foreground mt-1">Typeform-style form builder SaaS</p>
        <h2 className="mt-4 text-sm font-medium">Server Status: {status}</h2>
      </div>
    </main>
  );
}
