import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useSite, fullAddress } from "../lib/useSite";
import Logo from "./Logo";
import SocialLinks from "./Social";
import OfficeMap from "./OfficeMap";
export default function Footer() {
  const { office: o, contact } = useSite(),
    wn = contact.whatsapp || "";
  const wa =
    wn.replace(/\D/g, "") || import.meta.env.VITE_WHATSAPP || "923021386969";
  const links = (arr) =>
    arr.map(([to, l]) => (
      <Link key={to} to={to} className="hover:text-gold">
        {l}
      </Link>
    ));
  return (
    <>
      <footer className="bg-coal border-t border-dgold/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-white/70">
          <div className="grid gap-3 content-start">
            <Logo />
            <p>Learn. Trade. Earn. Repeat.</p>
            <SocialLinks />
          </div>
          <div className="grid gap-1 content-start">
            <h3 className="text-gold mb-1 font-semibold">Official office</h3>
            <p>{fullAddress(o) || "Office address will be published soon."}</p>
            {o.hours && <p>Hours: {o.hours}</p>}
            {o.phone && (
              <a href={`tel:${o.phone}`} className="hover:text-gold">
                Phone: {o.phone}
              </a>
            )}
            {o.email && (
              <a href={`mailto:${o.email}`} className="hover:text-gold">
                {o.email}
              </a>
            )}
            {wn && (
              <a href={`https://wa.me/${wa}`} className="hover:text-gold">
                WhatsApp: {wn}
              </a>
            )}
            <Link to="/office" className="text-gold mt-1">
              Appointments and directions
            </Link>
          </div>
          <div className="grid gap-1 content-start">
            <h3 className="text-gold mb-1 font-semibold">Explore</h3>
            {links([
              ["/courses", "Courses"],
              ["/vip", "VIP Membership"],
              ["/apply", "Apply Online"],
              ["/track", "Track Application"],
              ["/verify", "Verify Certificate"],
              ["/contact", "Contact"],
            ])}
          </div>
          <div className="grid gap-1 content-start">
            <h3 className="text-gold mb-1 font-semibold">Legal</h3>
            {links([
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms & Conditions"],
              ["/refund", "Refund Policy"],
              ["/risk", "Risk Disclosure"],
              ["/faq", "FAQ"],
              ["/admin/login", "Team login"],
            ])}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <OfficeMap office={o} wa={wn.replace(/\D/g, "")} height="h-48" />
        </div>
        <div className="border-t border-white/10 text-center text-xs text-white/50 py-4 px-4 grid gap-1">
          <p>
            Trading involves risk. Content is educational and not financial
            advice. No profit is guaranteed.
          </p>
          <p>
            &copy; {new Date().getFullYear()} MAXAM TRADER INSTITUTE. All Rights
            Reserved.
          </p>
        </div>
      </footer>
      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-20 xl:bottom-5 right-5 bg-profit text-ink p-3 rounded-full shadow-lg"
      >
        <MessageCircle />
      </a>
    </>
  );
}
