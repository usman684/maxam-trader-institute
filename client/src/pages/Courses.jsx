import { Link, useParams } from "react-router-dom";
import {
  Star,
  Users,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { pkr } from "../data/courses";
import { useCourses } from "../lib/useCourses";

const courseImages = {
  "forex-trading-mastery":
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85",

  "crypto-trading-course":
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=85",

  "xauusd-gold-king":
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85",

  "vip-lifetime-mentorship":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
};

const getImage = (c) =>
  c.image || courseImages[c.slug] || courseImages["forex-trading-mastery"];

const off = (c) =>
  c.original && c.original > c.fee
    ? Math.round((1 - c.fee / c.original) * 100)
    : 0;

const Price = ({ c }) => (
  <div className="flex items-center flex-wrap gap-2 mt-4">
    <span className="text-gold text-2xl font-bold">{pkr(c.fee)}</span>

    {c.original > c.fee && (
      <>
        <s className="text-white/40 text-sm">{pkr(c.original)}</s>

        <span className="text-xs bg-profit text-ink px-2 py-1 rounded">
          {off(c)}% OFF
        </span>
      </>
    )}
  </div>
);

const Meta = ({ c }) => (
  <div className="flex flex-wrap gap-3 text-white/60 text-xs mt-3">
    <span className="flex items-center gap-1">
      <Clock size={14} /> {c.duration}
    </span>

    <span className="flex items-center gap-1">
      <BookOpen size={14} /> {c.level}
    </span>

    {c.rating && (
      <span className="flex items-center gap-1">
        <Star size={14} className="text-gold" />
        {c.rating}
      </span>
    )}

    {c.enrolled && (
      <span className="flex items-center gap-1">
        <Users size={14} /> {c.enrolled} Students
      </span>
    )}
  </div>
);

export function Courses() {
  const courses = useCourses();

  return (
    <main className="min-h-screen">
      {/* PAGE HERO */}
      <section className="relative overflow-hidden border-b border-dgold/30">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#171007] to-black" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <p className="text-gold text-xs tracking-[.3em] uppercase">
            MAXAM Trader Institute
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-4 gold-text">
            Explore Our Courses
          </h1>

          <p className="text-white/65 max-w-2xl mt-5 leading-7">
            Learn Forex, Cryptocurrency and Gold trading through structured
            education, practical learning and professional mentorship.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <span className="border border-dgold/40 rounded-full px-4 py-2 text-sm">
              Forex Trading
            </span>
            <span className="border border-dgold/40 rounded-full px-4 py-2 text-sm">
              Crypto Trading
            </span>
            <span className="border border-dgold/40 rounded-full px-4 py-2 text-sm">
              Gold Trading
            </span>
            <span className="border border-gold/60 text-gold rounded-full px-4 py-2 text-sm">
              VIP Mentorship
            </span>
          </div>
        </div>
      </section>

      {/* COURSE CARDS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest">
              Find your learning path
            </p>
            <h2 className="text-3xl font-bold mt-2">Our Training Programs</h2>
          </div>

          <p className="text-white/50 text-sm">
            {courses.length} Available Programs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {courses.map((c) => (
            <article
              key={c.slug}
              className="group bg-coal border border-dgold/30 rounded-2xl overflow-hidden hover:border-gold/70 transition duration-300 hover:-translate-y-1"
            >
              {/* COURSE IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getImage(c)}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                {c.badge && (
                  <span className="absolute top-4 left-4 bg-gold text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    {c.badge}
                  </span>
                )}

                {c.slug === "vip-lifetime-mentorship" && (
                  <span className="absolute top-4 right-4 bg-black/80 text-gold border border-gold/50 text-xs px-3 py-1.5 rounded-full">
                    VIP PREMIUM
                  </span>
                )}

                <h3 className="absolute bottom-4 left-5 right-5 text-2xl font-bold text-white">
                  {c.title}
                </h3>
              </div>

              {/* COURSE DETAILS */}
              <div className="p-6">
                <Meta c={c} />

                {c.description && (
                  <p className="text-white/60 text-sm mt-4 leading-6">
                    {c.description}
                  </p>
                )}

                <Price c={c} />

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Link
                    to={`/courses/${c.slug}`}
                    className="btn-line text-center text-sm flex items-center justify-center gap-1"
                  >
                    Details <ArrowRight size={15} />
                  </Link>

                  <Link
                    to={`/apply?course=${c.slug}`}
                    className="btn-gold text-center text-sm"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-dgold/40 bg-coal p-7 md:p-10 flex flex-col md:flex-row items-center gap-5">
          <ShieldCheck size={42} className="text-gold shrink-0" />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">Learn with MAXAM</h2>

            <p className="text-white/60 mt-2 text-sm leading-6">
              Build your market knowledge with structured educational programs.
              Trading involves financial risk and no course guarantees profits.
            </p>
          </div>

          <Link to="/contact" className="btn-line whitespace-nowrap">
            Contact Institute
          </Link>
        </div>
      </section>
    </main>
  );
}

export function CourseDetail() {
  const courses = useCourses();
  const { slug } = useParams();

  const c = courses.find((x) => x.slug === slug);

  if (!c) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold">Course Not Found</h1>
        <Link to="/courses" className="text-gold mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/courses" className="text-gold text-sm">
        ← Back to All Courses
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 mt-8 items-center">
        <div className="rounded-2xl overflow-hidden border border-dgold/30">
          <img
            src={getImage(c)}
            alt={c.title}
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>

        <div>
          <p className="text-gold uppercase text-xs tracking-widest">
            MAXAM Training Program
          </p>

          <h1 className="text-4xl md:text-5xl font-bold gold-text mt-3">
            {c.title}
          </h1>

          <Meta c={c} />

          <Price c={c} />

          <p className="text-white/60 mt-5 leading-7">
            {c.description ||
              "Develop your trading knowledge through structured lessons, practical education and professional guidance."}
          </p>

          <Link
            to={`/apply?course=${c.slug}`}
            className="btn-gold inline-block mt-7"
          >
            Enroll in This Course
          </Link>
        </div>
      </div>

      {c.outcomes?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-5">What You Will Learn</h2>

          <div className="grid md:grid-cols-2 gap-3">
            {c.outcomes.map((o) => (
              <div
                key={o}
                className="bg-coal border border-dgold/30 rounded-lg p-4"
              >
                <span className="text-gold mr-2">✓</span>
                {o}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-2xl font-bold mb-5">Course Syllabus</h2>

        <div className="border border-dgold/30 rounded-xl overflow-hidden">
          {(c.syllabus || []).map((s, i) => (
            <details
              key={s}
              className="border-b border-white/10 p-5 last:border-0"
            >
              <summary className="cursor-pointer font-medium hover:text-gold">
                Module {i + 1}: {s}
              </summary>

              <p className="text-white/60 text-sm mt-3">
                Lessons, notes and educational sessions for this topic are
                available through the student learning portal.
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 bg-coal border border-dgold/30 rounded-xl p-6 flex gap-4">
        <Award className="text-gold shrink-0" size={28} />
        <p className="text-white/65 text-sm leading-6">
          A verifiable certificate with a QR code may be issued after successful
          course completion and institute verification.
        </p>
      </div>

      <p className="text-white/40 text-xs mt-6">
        Trading involves financial risk. Educational content does not guarantee
        profits or investment returns.
      </p>
    </main>
  );
}
