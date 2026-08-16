import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Home,
  LogOut,
  Menu,
  Package,
  Plus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FullPageSpinner } from "./ui";

export function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" replace />;
  return children;
}

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest-500 text-white">
        <ChefHat size={19} />
      </div>
      <div className="leading-tight">
        <strong className="block font-display text-[15px] font-semibold text-ink">FoodLink</strong>
        <span className="block text-[11px] text-forest-500/80">Smart Donation</span>
      </div>
    </div>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const role = user?.role;

  const links =
    role === "DONOR"
      ? [
          ["/app", "Dashboard", Home],
          ["/app/donate", "Donate Food", Plus],
          ["/app/my-donations", "My Donations", Package],
          ["/app/donor-profile", "Donor Profile", UserRound],
        ]
      : role === "NGO"
      ? [
          ["/app", "Dashboard", Home],
          ["/app/donations", "Available Donations", Package],
          ["/app/claims", "Claims", Users],
          ["/app/ngo-profile", "NGO Profile", UserRound],
        ]
      : [
          ["/app", "Dashboard", Home],
          ["/app/donations", "Donations", Package],
          ["/app/claims", "Claims", Users],
          ["/app/ngos", "NGOs", Users],
          ["/app/donors", "Donors", UserRound],
        ];

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-forest-800 p-5 text-white transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="[&_strong]:text-white [&_span]:text-forest-200">
            <Brand />
          </div>
          <button className="text-forest-200 md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-forest-700/70 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-forest-100 font-bold text-forest-700">
            {user?.name?.slice(0, 1)?.toUpperCase()}
          </div>
          <div className="leading-tight">
            <strong className="block text-sm">{user?.name}</strong>
            <span className="block text-[11px] text-forest-200">{user?.role}</span>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              to={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-100 transition hover:bg-forest-700/70 hover:text-white"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-100 transition hover:bg-forest-700/70 hover:text-white"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {open && (
        <div className="fixed inset-0 z-20 bg-black/35 md:hidden" onClick={() => setOpen(false)} />
      )}

      <main className="min-h-screen flex-1">
        <header className="flex h-[74px] items-center justify-between gap-4 border-b border-forest-100 bg-white px-5 md:px-8">
          <button className="text-forest-700 md:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div>
            <span className="eyebrow">Smart Food Waste & Donation Platform</span>
            <h1 className="font-display text-lg font-semibold text-ink">
              {user?.role === "DONOR" ? "Donor Portal" : user?.role === "NGO" ? "NGO Portal" : "Admin Portal"}
            </h1>
          </div>
          <Link
            to="/app/profile"
            className="flex items-center gap-2 rounded-full border border-forest-100 px-3 py-2 text-xs font-medium text-forest-600 hover:border-forest-300"
          >
            <UserRound size={16} />
            <span className="hidden sm:inline">{user?.email}</span>
          </Link>
        </header>
        <div className="mx-auto max-w-[1400px] p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
