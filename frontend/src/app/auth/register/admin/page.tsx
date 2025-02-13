import AuthForm from "@/components/AuthForm";

export default function RegisterAdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="register" role="admin" />
    </main>
  );
}
