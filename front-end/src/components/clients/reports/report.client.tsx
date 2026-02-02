"use client";

import MyOsSummaryPage from "@/src/components/clients/reports/MySummaryOs";
import OsFinancialPage from "./OsFinancial";
import UserProductivityChart from "./UserProductivityChart";

export default function ReportClient() {
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="h-50">
          <MyOsSummaryPage />
        </div>
        <div className="h-50">
          <OsFinancialPage />
        </div>
      </div>

      <div className="h-90 mt-4">
        <UserProductivityChart />
      </div>
    </>
  );
}
