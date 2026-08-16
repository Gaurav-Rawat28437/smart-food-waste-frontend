import { useAuth } from "../context/AuthContext";
import { Card, Page } from "../components/ui";

export default function Profile() {
  const { user } = useAuth();
  return (
    <Page title="Profile" subtitle="Your account and role information.">
      <Card className="mx-auto max-w-[480px] text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-100 text-2xl font-bold text-forest-700">
          {user?.name?.slice(0, 1)?.toUpperCase()}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold">{user?.name}</h2>
        <p className="text-forest-500">{user?.email}</p>
        <span className="mt-2 inline-flex rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-bold uppercase text-forest-600">
          {user?.role}
        </span>
        <p className="mt-5 text-sm text-forest-400">Role-based actions are enabled by your session cookie.</p>
      </Card>
    </Page>
  );
}
