import { MapPin } from "lucide-react";
import { Priority, Status } from "./ui";

export function DonationTable({ donations: items }) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Donation", "Food", "Qty", "Status", "Priority", "NGO"].map((h) => (
              <th key={h} className="border-b border-forest-100 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-forest-500/80">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d._id || d.donationId} className="border-b border-forest-50 last:border-0">
              <td className="px-3 py-3.5 text-sm">
                <strong className="block">{d.donationId}</strong>
                <small className="text-forest-400">{d.location}</small>
              </td>
              <td className="px-3 py-3.5 text-sm">
                {d.foodName}
                <small className="block text-forest-400">{d.category}</small>
              </td>
              <td className="px-3 py-3.5 text-sm">
                {d.quantity} {d.unit}
              </td>
              <td className="px-3 py-3.5">
                <Status value={d.status} />
              </td>
              <td className="px-3 py-3.5">
                <Priority value={d.priority} />
              </td>
              <td className="px-3 py-3.5 text-sm">{d.recommendedNGO || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DonationCards({ donations: items, onClaim }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => (
        <article
          key={d._id || d.donationId}
          className="animate-rise rounded-xl2 border border-forest-100 bg-white p-4 transition hover:shadow-card"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-forest-400">{d.donationId}</span>
            <Priority value={d.priority} />
          </div>
          <h4 className="mt-3 font-display text-lg font-semibold text-ink">{d.foodName}</h4>
          <p className="mt-0.5 text-sm text-forest-500">
            {d.quantity} {d.unit} · {d.category}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-500">
            <MapPin size={14} /> {d.location}
          </p>
          <div className="my-3.5 rounded-xl bg-forest-50/70 p-3">
            <strong className="block text-[10px] font-bold uppercase tracking-wide text-forest-500/80">
              DA recommendation
            </strong>
            <span className="mt-1 block text-sm font-bold text-forest-700">
              {d.recommendedNGO || "No NGO recommendation"}
            </span>
            {d.reason && <small className="mt-1 block text-xs text-forest-500">{d.reason}</small>}
          </div>
          {onClaim && (
            <button className="btn-primary w-full" onClick={() => onClaim(d)}>
              Claim donation
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
