import { PyramidIcon } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <PyramidIcon size={24} className="text-primary" />
      <h1 className="text-md font-bold">Stage</h1>
    </div>
  );
}
