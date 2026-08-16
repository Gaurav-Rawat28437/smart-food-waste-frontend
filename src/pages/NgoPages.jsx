import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, HeartHandshake, Package, Sparkles } from "lucide-react";
import { claims, donations, ngos } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card, Empty, ErrorBox, Loading, Page, Stat, Status, SuccessBox } from "../components/ui";
import { DonationCards } from "../components/Donations";

export function NgoHome() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    donations
      .list()
      .then((r) => setItems(r.data?.donations || []))
      .catch((e) => setError(e.response?.data?.message || "Could not load donations"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Loading text="Loading available donations…" />;

  const available = items.filter((x) => x.status === "AVAILABLE");
  const high = available.filter((x) => x.priority === "HIGH").length;

  return (
    <Page title={`Welcome, ${user?.name}`} subtitle="Available donations, prioritized by urgency.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={Package} label="Available" value={available.length} />
        <Stat icon={Sparkles} label="High priority" value={high} tone="rose" />
      </div>
      {error && <ErrorBox message={error} />}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Priority opportunities</h3>
            <p className="text-sm text-forest-500">Donations already annotated by the DA workflow.</p>
          </div>
        </div>
        {available.length ? (
          <DonationCards donations={available.slice(0, 6)} onClaim={(d) => claimDonation(d, load, setError)} />
        ) : (
          <Empty text="No available donations right now." />
        )}
      </Card>
    </Page>
  );
}

async function claimDonation(donation, reload, setError) {
  try {
    await claims.create({ claimId: `CLM${Date.now()}`, donationId: donation._id });
    reload();
  } catch (e) {
    setError(e.response?.data?.message || "Could not claim donation");
  }
}

export function AvailableDonations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    donations
      .list()
      .then((r) => setItems(r.data?.donations || []))
      .catch((e) => setError(e.response?.data?.message || "Could not load donations"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <Loading text="Loading donations…" />;

  const available = items.filter((x) => x.status === "AVAILABLE");

  return (
    <Page title="Available donations" subtitle="Claim what your organization can pick up and deliver.">
      {error && <ErrorBox message={error} />}
      {available.length ? (
        <DonationCards donations={available} onClaim={(d) => claimDonation(d, load, setError)} />
      ) : (
        <Empty text="No available donations." />
      )}
    </Page>
  );
}

export function NgoProfile() {
  const nav = useNavigate();
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ organizationName: "", phone: "", address: "", capacity: "", foodTypes: "Cooked Food, Rice" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await ngos.createProfile({
        ngoId: `NGO${Date.now()}`,
        organizationName: form.organizationName,
        phone: form.phone,
        address: form.address,
        capacity: Number(form.capacity),
        foodTypes: form.foodTypes.split(",").map((x) => x.trim()).filter(Boolean),
      });
      setCreated(true);
      setMessage("NGO profile created successfully.");
    } catch (e2) {
      setError(e2.response?.data?.message || "Could not create NGO profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="NGO profile" subtitle="Used for matching donations to your capacity and food types.">
      <Card className="max-w-[640px]">
        {message && <SuccessBox message={message} />}
        {error && <ErrorBox message={error} />}
        {created ? (
          <div className="grid place-items-center gap-2 py-10 text-center">
            <CheckCircle2 size={40} className="text-forest-500" />
            <p className="text-sm text-forest-600">Profile saved. You can now review available donations.</p>
            <button className="btn-primary mt-2" onClick={() => nav("/app/donations")}>
              View available donations
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <label className="field">
              Organization name
              <input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="field">
                Phone
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="field">
                Capacity
                <input required type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </label>
            </div>
            <label className="field">
              Address
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
            <label className="field">
              Food types
              <select
                multiple
                value={form.foodTypes.split(",").map((x) => x.trim())}
                onChange={(e) => setForm({ ...form, foodTypes: Array.from(e.target.selectedOptions).map((o) => o.value).join(", ") })}
              >
                <option>Cooked Food</option>
                <option>Rice</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Bakery</option>
                <option>Other</option>
              </select>
            </label>
            <button className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Saving…" : "Create NGO profile"}
            </button>
          </form>
        )}
      </Card>
    </Page>
  );
}

export function ClaimsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    claims
      .list()
      .then((r) => setItems(r.data?.claims || []))
      .catch((e) => setError(e.response?.data?.message || "Could not load claims"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading claims…" />;

  return (
    <Page title="Claims" subtitle="All claims visible to your role.">
      {error && <ErrorBox message={error} />}
      <Card>
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Claim", "Donation", "NGO", "Status", "Claimed at"].map((h) => (
                  <th key={h} className="border-b border-forest-100 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-forest-500/80">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id} className="border-b border-forest-50 last:border-0">
                  <td className="px-3 py-3.5 text-sm font-semibold">{c.claimId}</td>
                  <td className="px-3 py-3.5 text-sm">{c.donationId?.foodName || c.donationId?.donationId || "—"}</td>
                  <td className="px-3 py-3.5 text-sm">{c.ngoId?.organizationName || "—"}</td>
                  <td className="px-3 py-3.5">
                    <Status value={c.status} />
                  </td>
                  <td className="px-3 py-3.5 text-sm text-forest-500">{c.claimedAt ? new Date(c.claimedAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <Empty text="No claims yet." />}
      </Card>
    </Page>
  );
}
