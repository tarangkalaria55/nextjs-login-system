export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
