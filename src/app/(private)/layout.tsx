import { Header } from "./_components/header";

export default function PrivateLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen w-full bg-muted">
      <Header />
      {children}
    </div>
  );
}
