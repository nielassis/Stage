import ReportClient from "@/src/components/clients/reports/report.client";

export default function ReportPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Relatórios
          </h1>
          <p className="text-muted-foreground">
            Acompanhe os principais indicadores e metricas do sistema
          </p>
        </div>
      </div>
      <ReportClient />
    </>
  );
}
