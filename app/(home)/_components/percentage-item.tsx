import type { ReactNode } from "react";

interface PercentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Icone */}
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-muted-foreground/10 p-2 hover:bg-muted-foreground/10">
          {icon}
        </div>
        <p className="text-sm text-muted-foreground max-[1100px]:text-xs">
          {title}
        </p>
      </div>
      <p className="text-sm font-bold max-[1100px]:text-xs">{value}%</p>
    </div>
  );
};

export default PercentageItem;
