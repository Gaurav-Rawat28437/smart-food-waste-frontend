import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, Truck, Users, Package } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { admin, donations, donors, ngos } from "../lib/api";
import { Card, Empty, ErrorBox, Loading, Page, Stat, SuccessBox } from "../components/ui";
import { DonationTable } from "../components/Donations";

const CHART_COLORS = ["#1F7A46", "#E2A93B", "#7C6FE0", "#3B9CE2", "#C1592F"];

export function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const load = () => {
    setLoading(true);
    admin
      .dashboard()
      .then((r) => setStats(r.data?.stats))
      .catch((e) => setError(e.response?.data?.message || "Could not load admin dashboard"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const runSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      await admin.syncDAOutput();
      setSyncMsg("DA output synced from the spreadsheet.");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Loading text="Loading admin dashboard…" />;
  if (error) return <ErrorBox message={error} />;

  const statusData = [
    { name: "Available", value: stats.availableDonations },
    { name: "Claimed", value: stats.claimedDonations },
    { name: "Picked up", value: stats.pickedUpDonations },
    { name: "Delivered", value: stats.deliveredDonations },
    { name: "Expired", value: stats.expiredDonations },
  ];

  return (
    <Page
      title="Admin dashboard"
      subtitle="A live overview of the donation network."
      action={
        <button className="btn-primary" onClick={runSync} disabled={syncing}>
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing…" : "Sync DA data"}
        </button>
      }
    >
      {syncMsg && <SuccessBox message={syncMsg} />}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={Users} label="Donors" value={stats.totalDonors} />
        <Stat icon={ShieldCheck} label="NGOs" value={stats.totalNGOs} tone="purple" />
        <Stat icon={Package} label="Donations" value={stats.totalDonations} />
        <Stat icon={Truck} label="Delivered" value={stats.deliveredDonations} tone="blue" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Donation status</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Status volume</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1F7A46" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Page>
  );
}

export function AdminDonations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    donations
      .list()
      .then((r) => setItems(r.data?.donations || []))
      .catch((e) => setError(e.response?.data?.message || "Could not load donations"))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  return (
    <Page title="All donations" subtitle="Every donation logged on the platform.">
      {error && <ErrorBox message={error} />}
      <Card>
        <DonationTable donations={items} />
        {!items.length && <Empty text="No donations yet." />}
      </Card>
    </Page>
  );
}

export function DirectoryPage({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fn = type === "ngos" ? ngos.list : donors.list;
    fn()
      .then((r) => setItems(r.data?.ngos || r.data?.donors || []))
      .catch((e) => setError(e.response?.data?.message || `Could not load ${type}`))
      .finally(() => setLoading(false));
  }, [type]);
  if (loading) return <Loading />;
  return (
    <Page title={type === "ngos" ? "NGOs" : "Donors"} subtitle={`Directory of registered ${type}.`}>
      {error && <ErrorBox message={error} />}
      <Card>
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Name", "Contact", "Address", ...(type === "ngos" ? ["Capacity", "Food types"] : [])].map((h) => (
                  <th key={h} className="border-b border-forest-100 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-forest-500/80">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x._id} className="border-b border-forest-50 last:border-0">
                  <td className="px-3 py-3.5 text-sm font-semibold">{x.organizationName}</td>
                  <td className="px-3 py-3.5 text-sm">{x.phone}</td>
                  <td className="px-3 py-3.5 text-sm">{x.address}</td>
                  {type === "ngos" && (
                    <>
                      <td className="px-3 py-3.5 text-sm">{x.capacity}</td>
                      <td className="px-3 py-3.5 text-sm">{Array.isArray(x.foodTypes) ? x.foodTypes.join(", ") : x.foodTypes}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <Empty text={`No ${type} yet.`} />}
      </Card>
    </Page>
  );
}
