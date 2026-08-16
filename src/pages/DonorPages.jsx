import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Package, Plus } from "lucide-react";
import { donations, donors, myDonationsCache } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card, Empty, ErrorBox, Page, Priority, Stat, SuccessBox } from "../components/ui";

export function DonorHome() {
  const { user } = useAuth();
  const nav = useNavigate();
  const items = myDonationsCache.all();
  const kg = items.reduce((s, x) => s + (Number(x.quantity) || 0), 0);

  return (
    <Page title={`Welcome, ${user?.name}`} subtitle="Log a donation, then see what you've reported from this device.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={Package} label="Logged (this device)" value={items.length} />
        <Stat icon={CheckCircle2} label="Quantity logged" value={`${kg} ${items[0]?.unit || "units"}`} tone="amber" />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Get started</h3>
            <p className="text-sm text-forest-500">Two steps: set up your donor profile, then log a donation.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button className="btn-ghost justify-start px-4 py-3.5 text-left" onClick={() => nav("/app/donor-profile")}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-50 text-forest-600">1</span>
            <span>
              <strong className="block">Donor profile</strong>
              <span className="text-xs font-normal text-forest-500">Organization name, phone, address</span>
            </span>
          </button>
          <button className="btn-primary justify-start px-4 py-3.5 text-left" onClick={() => nav("/app/donate")}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20">2</span>
            <span>
              <strong className="block">Donate food</strong>
              <span className="text-xs font-normal text-forest-50">Food, quantity, expiry, location</span>
            </span>
          </button>
        </div>
      </Card>
    </Page>
  );
}

export function DonorProfile() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ organizationName: "", phone: "", address: "" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await donors.createProfile(form);
      setMessage("Donor profile created successfully.");
      setTimeout(() => nav("/app/donate"), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create donor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Donor profile" subtitle="This is the organization or individual food is donated under.">
      <Card className="max-w-[560px]">
        {message && <SuccessBox message={message} />}
        {error && <ErrorBox message={error} />}
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <label className="field">
            Organization / your name
            <input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
          </label>
          <label className="field">
            Phone
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="field">
            Address
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Saving…" : "Save donor profile"}
          </button>
        </form>
      </Card>
    </Page>
  );
}

export function Donate() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    foodName: "",
    category: "Cooked Food",
    quantity: "",
    unit: "kg",
    location: "",
    expiryTime: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        donationId: `DNT${Date.now()}`,
        ...form,
        quantity: Number(form.quantity),
        expiryTime: new Date(form.expiryTime).toISOString(),
      };
      const { data } = await donations.create(payload);
      myDonationsCache.add(data.donation || payload);
      nav("/app/my-donations");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Donate food" subtitle="This listing becomes visible to NGOs once it's saved.">
      <Card className="max-w-[640px]">
        <form className="flex flex-col gap-4" onSubmit={submit}>
          {error && <ErrorBox message={error} />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">
              Food name
              <input required value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })} />
            </label>
            <label className="field">
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Cooked Food</option>
                <option>Rice</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Bakery</option>
                <option>Other</option>
              </select>
            </label>
            <label className="field">
              Quantity
              <input required type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </label>
            <label className="field">
              Unit
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option>kg</option>
                <option>packets</option>
                <option>boxes</option>
                <option>litres</option>
              </select>
            </label>
          </div>
          <label className="field">
            Location
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label className="field">
            Expiry time
            <input required type="datetime-local" value={form.expiryTime} onChange={(e) => setForm({ ...form, expiryTime: e.target.value })} />
          </label>
          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Creating…" : "Create donation"}
          </button>
        </form>
      </Card>
    </Page>
  );
}

export function MyDonations() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(myDonationsCache.all());
  }, []);

  return (
    <Page
      title="My donations"
      subtitle="Saved on this device — the platform doesn't yet offer a shared donor history."
      action={
        <a href="/app/donate" className="btn-primary">
          <Plus size={16} /> Donate food
        </a>
      }
    >
      {items.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <article key={d.donationId} className="rounded-xl2 border border-forest-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-forest-400">{d.donationId}</span>
                <Priority value={d.priority} />
              </div>
              <h4 className="mt-3 font-display text-lg font-semibold">{d.foodName}</h4>
              <p className="mt-0.5 text-sm text-forest-500">
                {d.quantity} {d.unit} · {d.category}
              </p>
              <p className="mt-1 text-sm text-forest-500">{d.location}</p>
            </article>
          ))}
        </div>
      ) : (
        <Empty text="No donations logged on this device yet." />
      )}
    </Page>
  );
}
