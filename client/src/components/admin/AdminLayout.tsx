import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <a href="/admin/dashboard" className="hover:text-gray-300">Food Items</a>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }}
            className="mt-6 w-full text-left hover:text-gray-300"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
