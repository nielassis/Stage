import { Card } from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "../layout/logo";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col space-y-12 justify-center items-center">
      <div className="flex w-full flex-col items-center gap-2">
        <Link href="/">
          <span className="text-muted-foreground text-sm items-center flex">
            <ArrowLeft className="mr-2" size={16} /> Voltar ao inicio
          </span>
        </Link>

        <Logo />
      </div>

      <Card className="w-full max-w-md rounded-xl p-8 shadow-sm">
        <div className="space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </Card>
    </div>
  );
}
