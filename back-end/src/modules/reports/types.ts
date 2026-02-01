import { OsStatus, OsStageStatus } from '@prisma/client';

/* =======================
   BASE
======================= */
export interface DateRangeQuery {
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/* =======================
   CUSTOMER REPORTS
======================= */
export interface CustomersGrowthReport {
  totalCustomers: number;
  newCustomers: number;
}

export interface CustomersListReportItem {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/* =======================
   OS REPORTS
======================= */
export interface OsStatusReportItem {
  status: OsStatus;
  total: number;
}

export interface OsFinancialReport {
  totalAmountCents: number;
  avgAmountCents: number;
}

export interface OsListReportItem {
  id: string;
  name: string;
  status: OsStatus;
  amountCents: number;
  createdAt: Date;
}

/* =======================
   OS STAGE REPORTS
======================= */
export interface StageStatusReportItem {
  status: OsStageStatus;
  total: number;
}

export interface StageTimeReportItem {
  osId: string;
  stageName: string;
  createdAt: Date;
  updatedAt: Date;
}

/* =======================
   USER REPORTS
======================= */
export interface UserProductivityReportItem {
  userId: string;
  name: string;
  responsibleCount: number;
  participantCount: number;
}

export interface UserActivityReportItem {
  userId: string;
  name: string;
  totalActions: number;
}
