"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { benefits, features, stats } from "../utils/landing-page/mock-data";
import { Header } from "@/src/components/misc/layout/header";
import { Footer } from "@/src/components/misc/layout/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <section className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sistema de Gestao de OS
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Gerencie ordens de servico com simplicidade
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Controle etapas, aprove tarefas e acompanhe o progresso da sua
            equipe. Tudo em um unico lugar.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/login">
                Comecar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-6 text-center">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <section id="features" className="mt-32 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Tudo que voce precisa
            </h2>
            <p className="mt-3 text-muted-foreground">
              Recursos completos para gerenciar suas ordens de servico.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-6 transition-colors hover:bg-accent/50"
              >
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-32">
          <div className="rounded-lg border border-border p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Por que escolher o Stage?
                </h2>
                <ul className="mt-8 space-y-4">
                  {benefits.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" asChild>
                  <Link href="/login">
                    Experimentar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-1.5 pb-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                </div>
                <div className="space-y-2">
                  {[
                    { status: "Em progresso", color: "bg-primary" },
                    { status: "Concluido", color: "bg-success" },
                    { status: "Pendente", color: "bg-warning" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-muted" />
                        <div className="h-2.5 w-24 rounded bg-muted" />
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${item.color} text-white`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Pronto para comecar?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Acesse o dashboard e experimente o Stage gratuitamente.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/login">
              Acessar o Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
