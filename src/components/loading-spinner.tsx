export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-700 dark:border-gray-300 border-solid"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300 text-lg font-semibold">
          Loading...
        </p>
      </div>
    </div>
  );
};
