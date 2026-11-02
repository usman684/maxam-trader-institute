import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Crown,
  Users,
  Video,
  Headphones,
  Infinity,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import api from "../lib/api";
import { T } from "./Public";

const vipBenefits = [
  {
    icon: Infinity,
    title: "Lifetime Course Access",
    description:
      "Access the included trading courses with lifetime learning access.",
  },
  {
    icon: ShieldCheck,
    title: "VIP Trading Signals",
    description: "Access the institute’s private educational VIP signals.",
  },
  {
    icon: Users,
    title: "Private VIP Community",
    description: "Connect with the VIP learning community.",
  },
  {
    icon: Video,
    title: "Live Trading Room",
    description: "Participate in live educational trading sessions.",
  },
  {
    icon: Headphones,
    title: "One-on-One Mentorship",
    description: "Get individual learning guidance and mentorship.",
  },
  {
    icon: Crown,
    title: "Advanced Strategies",
    description: "Explore advanced market analysis and trading strategies.",
  },
];

const vipImages = [
  {
    title: "Professional Trading",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Crypto Markets",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Gold Trading",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85",
  },
];

const includedCourses = [
  "Forex Trading Mastery",
  "Crypto Trading Course",
  "XAUUSD / Gold King",
];

export default function ContentPage({ k }) {
  const [items, setItems] = useState([]);
  const [end, setEnd] = useState(null);
  const [left, setLeft] = useState("");

  const type = {
    mentors: "mentor",
    results: "result",
    reviews: "review",
    faq: "faq",
  };

  useEffect(() => {
    setItems([]);
    setEnd(null);

    if (type[k]) {
      api
        .get(`/content/${type[k]}`)
        .then((r) => setItems(r.data))
        .catch(() => setItems([]));
    }

    if (k === "vip") {
      api
        .get("/settings")
        .then((r) => setEnd(r.data.offerEnd || null))
        .catch(() => setEnd(null));
    }
  }, [k]);

  useEffect(() => {
    if (!end) return;

    const update = () => {
      const d = new Date(end).getTime() - Date.now();

      setLeft(
        d > 0
          ? `${Math.floor(d / 86400000)}d ${Math.floor((d % 86400000) / 3600000)}h ${Math.floor((d % 3600000) / 60000)}m ${Math.floor((d % 60000) / 1000)}s`
          : "Offer ended",
      );
    };

    update();
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [end]);

  // PREMIUM VIP PAGE
  if (k === "vip") {
    return (
      <main className="min-h-screen">
        {/* VIP HERO */}
        <section className="relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85"
            alt="Premium trading analytics"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />

          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
            <div className="flex items-center gap-2 text-gold uppercase tracking-[.3em] text-xs font-semibold">
              <Crown size={18} />
              MAXAM Exclusive Membership
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold gold-text mt-6 max-w-3xl">
              MAXAM VIP
              <br />
              LIFETIME MENTORSHIP
            </h1>

            <p className="text-white/75 text-base md:text-xl max-w-2xl mt-6 leading-8">
              Take your trading education further with lifetime course access,
              educational VIP signals, private community and professional
              mentorship.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                to="/apply?course=vip-lifetime-mentorship"
                className="btn-gold inline-flex items-center gap-2"
              >
                Join VIP Membership
                <ArrowRight size={18} />
              </Link>

              <Link to="/contact" className="btn-line">
                Contact Us
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-12 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Infinity className="text-gold" size={18} />
                Lifetime Access
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck className="text-gold" size={18} />
                VIP Membership
              </span>

              <span className="flex items-center gap-2">
                <Users className="text-gold" size={18} />
                Private Community
              </span>
            </div>
          </div>
        </section>

        {/* VIP PRICE */}
        <section className="max-w-7xl mx-auto px-4 -mt-2 py-12">
          <div className="max-w-3xl mx-auto rounded-2xl border border-gold/50 bg-gradient-to-br from-[#211807] via-coal to-black p-8 md:p-12 text-center shadow-xl">
            <Crown className="mx-auto text-gold" size={42} />

            <p className="text-gold uppercase tracking-[.25em] text-xs mt-5">
              Exclusive Lifetime Package
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              VIP Membership
            </h2>

            <div className="text-4xl md:text-6xl font-extrabold text-gold mt-6">
              Rs. 59,999
            </div>

            <p className="text-white/50 text-sm mt-3">
              One-time package price • Lifetime access
            </p>

            {left && <p className="text-gold mt-5">Special offer: {left}</p>}

            <Link
              to="/apply?course=vip-lifetime-mentorship"
              className="btn-gold inline-flex items-center justify-center gap-2 mt-8 w-full sm:w-auto"
            >
              Apply for VIP Now
              <ArrowRight size={18} />
            </Link>

            <p className="text-xs text-white/40 mt-4">
              VIP access is activated after payment verification by admin.
            </p>
          </div>
        </section>

        {/* VIP BENEFITS */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <p className="text-gold text-xs uppercase tracking-[.25em]">
              Premium Benefits
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Everything Included in VIP
            </h2>

            <p className="text-white/55 mt-3">
              A complete trading education and mentorship package.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipBenefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-coal border border-dgold/30 hover:border-gold/70 rounded-2xl p-7 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                  <Icon size={26} className="text-gold" />
                </div>

                <h3 className="text-xl font-bold">{title}</h3>

                <p className="text-white/55 text-sm leading-6 mt-3">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TRADING IMAGE GALLERY */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <p className="text-gold text-xs uppercase tracking-widest">
              Trading Environment
            </p>

            <h2 className="text-3xl font-bold mt-3">Explore the Markets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {vipImages.map((item) => (
              <div
                key={item.title}
                className="relative h-64 rounded-2xl overflow-hidden group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                <h3 className="absolute bottom-5 left-5 text-xl font-bold">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* INCLUDED COURSES */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-8">
            <p className="text-gold text-xs uppercase tracking-widest">
              Included Programs
            </p>

            <h2 className="text-3xl font-bold mt-3">
              Three Major Trading Courses
            </h2>
          </div>

          <div className="max-w-3xl mx-auto grid gap-4">
            {includedCourses.map((course) => (
              <div
                key={course}
                className="flex items-center gap-4 bg-coal border border-dgold/30 rounded-xl p-5"
              >
                <CheckCircle2 className="text-gold shrink-0" size={23} />
                <span className="font-semibold">{course}</span>
              </div>
            ))}
          </div>
        </section>

        {/* VIP CTA */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-r from-[#251a08] to-black p-8 md:p-14 text-center">
            <Star className="text-gold mx-auto" size={35} />

            <h2 className="text-3xl md:text-5xl font-bold mt-5">
              Start Your VIP Journey
            </h2>

            <p className="text-white/60 max-w-xl mx-auto mt-4 leading-7">
              Join MAXAM VIP and take the next step in your trading education.
            </p>

            <Link
              to="/apply?course=vip-lifetime-mentorship"
              className="btn-gold inline-flex items-center gap-2 mt-8"
            >
              Apply Online
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <p className="max-w-7xl mx-auto px-4 pb-8 text-xs text-white/40">
          Trading involves substantial financial risk. Signals and educational
          content do not guarantee profits or investment returns.
        </p>
      </main>
    );
  }

  // OTHER CONTENT PAGES - ORIGINAL FUNCTIONALITY PRESERVED
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold gold-text">{T[k][0]}</h1>

      <p className="mt-4 text-white/70 leading-7">{T[k][1]}</p>

      {left && (
        <p className="mt-6 text-2xl text-gold font-display">
          Offer ends in {left}
        </p>
      )}

      <div className="mt-8 grid gap-4">
        {items.map((i) => (
          <div
            key={i._id}
            className="bg-coal border border-dgold/30 rounded p-4 flex gap-4"
          >
            {i.image && (
              <img
                src={i.image}
                alt={i.title || ""}
                loading="lazy"
                className="w-20 h-20 object-cover rounded"
              />
            )}

            <div>
              <b>{i.title}</b>
              <p className="text-white/70 text-sm mt-1">{i.body}</p>
            </div>
          </div>
        ))}
      </div>

      {k === "results" && (
        <p className="text-xs text-white/40 mt-6">
          Results are shared with permission. Past performance does not
          guarantee future results.
        </p>
      )}
    </div>
  );
}
