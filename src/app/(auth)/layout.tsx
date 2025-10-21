import { GalleryVerticalEnd } from "lucide-react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-muted gap-6">
      <div className="hidden md:flex items-center gap-3 self-center font-medium text-xl">
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-8" />
        </div>
        FitWell
      </div>
      {children}
    </div>
  );
}
