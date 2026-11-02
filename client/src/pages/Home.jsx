import { useState, useEffect } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  Coins,
  ShieldCheck,
} from "lucide-react";
import HomeExtra from "./HomeExtra";
import Ticker from "../components/Ticker";
import { pkr } from "../data/courses";
import { useCourses } from "../lib/useCourses";

const markets = [
  {
    title: "Forex Trading",
    text: "Learn currency pairs, technical analysis and professional trading strategies.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1100&q=85",
    icon: BarChart3,
  },
  {
    title: "Crypto Trading",
    text: "Explore Bitcoin, cryptocurrency markets and digital asset trading.",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1100&q=85",
    icon: Bitcoin,
  },
  {
    title: "Gold Trading",
    text: "Understand XAUUSD, gold price action and market opportunities.",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1100&q=85",
    icon: Coins,
  },
];

export default function Home() {
  const courses = useCourses();
  const [st, setSt] = useState({});
  const [noVideo, setNoVideo] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then((r) => setSt(r.data.stats || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* HERO - ORIGINAL BACKGROUND VIDEO PRESERVED */}
      <section className="theme-dark relative min-h-[88vh] flex items-center overflow-hidden">
        {!noVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero.jpg"
            onError={() => setNoVideo(true)}
          >
            <source
              src="/hero.mp4"
              type="video/mp4"
              onError={() => setNoVideo(true)}
            />
          </video>
        )}

        {noVideo && (
          <div className="candles" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.25}s` }} />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto px-4 py-20 w-full"
        >
          <p className="text-gold uppercase tracking-[.25em] text-xs md:text-sm font-semibold mb-4">
            Learn • Practice • Trade with discipline
          </p>

          <h1 className="text-4xl md:text-7xl font-extrabold gold-text">
            MAXAM TRADER INSTITUTE
          </h1>

          <p className="mt-5 text-xl md:text-2xl max-w-2xl">
            Pakistan's Leading Professional Trading Education Institute
          </p>

          <p className="mt-3 text-white/70 max-w-xl">
            Master Forex, Cryptocurrency and Gold Trading with Professional
            Mentorship.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/apply" className="btn-gold">
              Apply Online
            </Link>
            <Link to="/courses" className="btn-line">
              Explore Courses
            </Link>
            <Link to="/demo" className="btn-line">
              Watch Free Demo
            </Link>
          </div>
        </motion.div>
      </section>

      <Ticker />

      {/* INSTITUTE STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          [st.students || "6,500+", "Students"],
          [st.rating || "4.9/5", "Student Rating"],
          [st.years || "3+", "Years Experience"],
          [st.positive || "92%", "Positive Reviews"],
        ].map(([n, l]) => (
          <div key={l}>
            <div className="text-3xl font-display font-bold text-gold">{n}</div>
            <div className="text-white/60 text-sm">{l}</div>
          </div>
        ))}
      </section>

      {/* TRADING MARKETS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-gold text-xs uppercase tracking-[.22em]">
              Explore the markets
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Professional Trading Education
            </h2>
            <p className="text-white/60 mt-2">
              Explore different financial markets with MAXAM.
            </p>
          </div>

          <Link
            to="/courses"
            className="text-gold text-sm inline-flex items-center gap-1"
          >
            All courses <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {markets.map(({ title, text, image, icon: Icon }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-dgold/30 min-h-[320px] bg-coal"
            >
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/5" />

              <div className="relative min-h-[320px] flex flex-col justify-end p-7">
                <Icon className="text-gold mb-4" size={30} />

                <h3 className="text-2xl font-bold">{title}</h3>

                <p className="text-white/75 text-sm mt-3">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-gold text-xs uppercase tracking-[.22em]">
              Choose your learning path
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Featured Courses
            </h2>
          </div>

          <Link to="/courses" className="text-gold text-sm">
            View all courses →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c) => (
            <Link
              key={c.slug}
              to={`/courses/${c.slug}`}
              className="group bg-coal border border-dgold/30 rounded-xl overflow-hidden hover:border-gold transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.imageAlt || c.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {c.badge && (
                  <span className="absolute top-3 left-3 text-xs bg-gold text-ink px-2 py-1 rounded font-semibold">
                    {c.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg">{c.title}</h3>

                <p className="text-white/55 text-sm mt-2">
                  {c.duration} • {c.level}
                </p>

                <p className="mt-3 text-gold font-bold">
                  {pkr(c.fee)}
                  {c.original && (
                    <s className="text-white/40 text-sm font-normal ml-2">
                      {pkr(c.original)}
                    </s>
                  )}
                </p>

                <p className="text-gold text-sm mt-4">Explore Course →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* VIP PROMOTION */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-[#201707] via-coal to-[#111] p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="text-gold shrink-0" size={32} />

            <div>
              <p className="text-gold text-xs uppercase tracking-[.2em]">
                Premium learning
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                Ready for the MAXAM VIP Experience?
              </h2>

              <p className="text-white/65 mt-2">
                Explore lifetime mentorship, private learning community and
                guided trading education.
              </p>
            </div>
          </div>

          <Link to="/vip" className="btn-gold whitespace-nowrap">
            Explore VIP Membership
          </Link>
        </div>
      </section>

      <HomeExtra />
    </>
  );
}
