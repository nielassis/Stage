import DashboardClientPage from "@/src/components/clients/dashboard/dashboard.client";

export default function DashboardPage() {
  return (
    <>
      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de ordens de serviço
        </p>
      </div>
      <DashboardClientPage />
    </>
  );
}
