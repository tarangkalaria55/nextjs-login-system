export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md shadow-lg">{children}</div>
    </div>
  );

  // <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
  //   {children}
  // </div>
}
