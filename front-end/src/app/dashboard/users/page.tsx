import UsersClientPage from "@/src/components/clients/users/users.client";

export default function UserRoutes() {
  return (
    <>
      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Usuarios
        </h1>
        <p className="text-muted-foreground">
          Gerencie os usuários da sua empresa
        </p>
      </div>

      <UsersClientPage />
    </>
  );
}
