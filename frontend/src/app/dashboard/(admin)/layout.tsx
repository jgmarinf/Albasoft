import Sidebar from "@/components/Sidebar";

export default function AdminDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
