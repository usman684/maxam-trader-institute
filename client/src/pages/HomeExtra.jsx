import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  LineChart,
  Headphones,
  MapPin,
  Award,
  Star,
  GraduationCap,
} from "lucide-react";
import api from "../lib/api";
import { useSite, fullAddress } from "../lib/useSite";
import OfficeMap from "../components/OfficeMap";

const why = [
  [
    Users,
    "Live Mentorship",
    "Learn directly from experienced mentors in live sessions.",
  ],
  [
    LineChart,
    "Structured Learning",
    "Follow a step-by-step syllabus from basics to advanced strategies.",
  ],
  [
    ShieldCheck,
    "Risk Management",
    "Understand capital protection and risk management before trading.",
  ],
  [
    Headphones,
    "Student Support",
    "Get guidance and support throughout your learning journey.",
  ],
];

const H = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-bold mb-6 gold-text">{children}</h2>
);

const Section = ({ children, className = "" }) => (
  <section className={`max-w-7xl mx-auto px-4 mt-20 ${className}`}>
    {children}
  </section>
);

export default function HomeExtra() {
  const site = useSite();

  const [d, setD] = useState({
    review: [],
    faq: [],
    mentor: [],
    result: [],
  });

  const [live, setLive] = useState([]);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const types = ["review", "faq", "mentor", "result"];

      await Promise.all(
        types.map(async (type) => {
          try {
            const response = await api.get(`/content/${type}`);
            if (active) {
              setD((old) => ({
                ...old,
                [type]: Array.isArray(response.data) ? response.data : [],
              }));
            }
          } catch (error) {
            console.error(`Unable to load ${type}:`, error);
          }
        }),
      );

      try {
        const response = await api.get("/live/public");
        if (active && Array.isArray(response.data)) {
          setLive(response.data);
        }
      } catch (error) {
        console.error("Unable to load live classes:", error);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {live.length > 0 && (
        <Section>
          <H>Upcoming Live Classes</H>
          <div className="grid md:grid-cols-3 gap-5">
            {live.slice(0, 3).map((item) => (
              <article
                key={item._id}
                className="bg-coal border border-dgold/30 rounded-xl p-5 hover:border-gold transition"
              >
                <div className="flex items-center gap-2 text-gold mb-3">
                  <GraduationCap size={20} />
                  <span className="text-xs uppercase tracking-widest">
                    Live Session
                  </span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-white/60 mt-2">
                  {item.date
                    ? new Date(item.date).toLocaleString()
                    : "Date to be announced"}
                </p>
                {item.mentor && (
                  <p className="text-sm text-gold mt-2">{item.mentor}</p>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <H>Why Choose MAXAM?</H>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {why.map(([Icon, title, description]) => (
            <article
              key={title}
              className="bg-coal border border-dgold/30 rounded-xl p-6 hover:border-gold transition"
            >
              <Icon size={30} className="text-gold mb-4" />
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/60 text-sm leading-6">{description}</p>
            </article>
          ))}
        </div>
      </Section>

      {d.mentor.length > 0 && (
        <Section>
          <H>Meet Your Mentors</H>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.mentor.slice(0, 3).map((mentor) => (
              <article
                key={mentor._id}
                className="bg-coal border border-dgold/30 rounded-xl overflow-hidden"
              >
                {mentor.image && (
                  <img
                    src={mentor.image}
                    alt={mentor.title || "MAXAM mentor"}
                    loading="lazy"
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg">{mentor.title}</h3>
                  <p className="text-white/60 text-sm mt-2 leading-6">
                    {mentor.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <Link to="/mentors" className="text-gold inline-block mt-5">
            View all mentors →
          </Link>
        </Section>
      )}

      {d.result.length > 0 && (
        <Section>
          <H>Student Success Stories</H>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.result.slice(0, 3).map((result) => (
              <article
                key={result._id}
                className="bg-coal border border-dgold/30 rounded-xl overflow-hidden"
              >
                {result.image && (
                  <img
                    src={result.image}
                    alt={result.title || "Student success story"}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <Award className="text-gold mb-3" size={24} />
                  <h3 className="font-bold">{result.title}</h3>
                  <p className="text-white/60 text-sm mt-2">{result.body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-4">
            Past trading results do not guarantee future performance.
          </p>
        </Section>
      )}

      {d.review.length > 0 && (
        <Section>
          <H>What Our Students Say</H>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.review.slice(0, 3).map((review) => (
              <article
                key={review._id}
                className="bg-coal border border-dgold/30 rounded-xl p-6"
              >
                <div className="flex gap-1 text-gold mb-4">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <Star key={number} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-6">
                  “{review.body}”
                </p>
                <h3 className="font-bold mt-4">{review.title}</h3>
              </article>
            ))}
          </div>
        </Section>
      )}

      {d.faq.length > 0 && (
        <Section className="max-w-3xl">
          <H>Frequently Asked Questions</H>
          <div className="space-y-3">
            {d.faq.map((faq) => (
              <details
                key={faq._id}
                className="bg-coal border border-dgold/30 rounded-xl p-5"
              >
                <summary className="cursor-pointer font-semibold">
                  {faq.title}
                </summary>
                <p className="text-white/60 text-sm leading-6 mt-3">
                  {faq.body}
                </p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="grid md:grid-cols-2 gap-8 items-center bg-coal border border-dgold/30 rounded-2xl p-6 md:p-8">
          <div>
            <MapPin className="text-gold mb-4" size={32} />
            <h2 className="text-2xl font-bold">Visit Our Office</h2>
            <p className="text-white/60 text-sm mt-3 leading-6">
              {fullAddress(site.office) ||
                "Alhafeez Executive Plaza, Third Floor, Firdous Market"}
            </p>
            {site.office.hours && (
              <p className="text-white/60 text-sm mt-2">
                Office Hours: {site.office.hours}
              </p>
            )}
            <Link to="/office" className="text-gold inline-block mt-5">
              Book an appointment →
            </Link>
          </div>

          <OfficeMap
            office={site.office}
            wa={(site.contact.whatsapp || "").replace(/\D/g, "")}
            height="h-64"
          />
        </div>
      </Section>

      <Section className="max-w-4xl text-center mb-16">
        <div className="bg-coal border border-dgold/40 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold gold-text">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-white/60 mt-4">
            Build your knowledge, improve your skills and learn with MAXAM.
          </p>
          <div className="mt-7 flex flex-wrap gap-4 justify-center">
            <Link to="/apply" className="btn-gold">
              Apply Online
            </Link>
            <Link to="/demo" className="btn-line">
              Book Free Demo
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
