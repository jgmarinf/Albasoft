import { getCurrentUser } from "@/lib/session";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen">
      {user.role === "admin" ? (
        <AdminDashboard role={user.role} />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}
