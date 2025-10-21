export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
        ></div>
      ))}
    </div>
  );
}
