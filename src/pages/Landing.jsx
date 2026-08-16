import { Link, useNavigate } from "react-router-dom";
import { BarChart3, ChevronRight, HeartHandshake, Package, Sparkles, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Brand } from "../components/Shell";

export default function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FAF6] to-paper">
      <header className="flex h-[78px] items-center justify-between px-6 md:px-[6vw]">
        <Brand />
        <div className="flex gap-2.5">
          {user ? (
            <button className="btn-primary" onClick={() => nav("/app")}>
              Open dashboard
            </button>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">
                Log in
              </Link>
              <Link className="btn-primary" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[1.2fr_.8fr] md:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-extrabold text-forest-600">
            <Sparkles size={14} /> Data-driven food redistribution
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-[58px]">
            Turn surplus food into <span className="text-forest-500">community impact.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-forest-600/90">
            Donors log what's ready to go. NGOs see what's urgent first. A priority
            score built from expiry time and quantity keeps food moving before it's wasted.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary px-5 py-3 text-base" to={user ? "/app" : "/register"}>
              Start donating <ChevronRight size={18} />
            </Link>
            <a className="btn-ghost px-5 py-3 text-base" href="#how">
              How it works
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="max-w-[360px] rounded-[28px] border border-forest-100 bg-white p-6 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-forest-500">
              <HeartHandshake size={22} />
            </div>
            <strong className="mt-5 block font-display text-2xl font-semibold">Smart match</strong>
            <p className="mt-1 text-sm text-forest-500">
              Every listing carries a priority reading so NGOs act on what's most urgent first.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-forest-50 pt-3.5">
              <div className="flex items-center gap-2">
                <div className="ripeness-ring" style={{ "--fill": "92%", "--ring-color": "#C1592F" }} />
                <span className="text-[11px] font-bold uppercase text-clay-600">High</span>
              </div>
              <b className="text-sm">Food For All NGO</b>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-4 px-6 pb-16 sm:grid-cols-3">
        {[
          [Package, "Donors", "Log surplus food in under a minute."],
          [Users, "NGOs", "Find, claim, and track pickups in one place."],
          [BarChart3, "Analytics", "A priority score flags what's most time-sensitive."],
        ].map(([Icon, title, copy]) => (
          <div key={title} className="rounded-2xl border border-forest-100 bg-white p-5">
            <Icon size={22} className="text-forest-500" />
            <strong className="mt-3 block font-display text-lg">{title}</strong>
            <span className="mt-1 block text-sm text-forest-500">{copy}</span>
          </div>
        ))}
      </section>

      <section id="how" className="mx-auto max-w-[1180px] px-6 pb-24">
        <span className="eyebrow">How it works</span>
        <h3 className="mt-2 font-display text-3xl font-semibold sm:text-[34px]">One simple operational loop</h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Donate", "A donor logs a food donation with quantity and expiry."],
            ["Prioritize", "A priority score is computed from urgency and size."],
            ["Claim", "An NGO claims the donation that fits their capacity."],
            ["Deliver", "Status moves from pickup through to delivered."],
          ].map(([title, copy], i) => (
            <div key={title} className="rounded-2xl bg-forest-800 p-5 text-white">
              <b className="text-xs text-forest-200">0{i + 1}</b>
              <strong className="mt-5 block font-display text-lg">{title}</strong>
              <span className="mt-1.5 block text-sm text-forest-200">{copy}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
