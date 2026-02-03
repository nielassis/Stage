import { Customer } from "@/src/utils/customers/types";

export default function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
      <div>
        <span className="text-sm text-muted-foreground">Nome</span>
        <p className="font-medium">{customer.name}</p>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Email</span>
        <p className="font-medium">{customer.email}</p>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Documento</span>
        <p className="font-medium">
          {customer.documentType} • {customer.document}
        </p>
      </div>
    </div>
  );
}
