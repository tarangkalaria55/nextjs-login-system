import Header from "./_components/header";

export default function PrivateLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      {children}
    </div>
  );
}
