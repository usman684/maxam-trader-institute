import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SocialLinks from "./Social";
import { useAuth, home } from "../lib/auth";

const base = [
  ["/", "Home"],
  ["/about", "About Institute"],
  ["/courses", "Courses"],
  ["/vip", "VIP Membership"],
  ["/results", "Results"],
  ["/mentors", "Mentors"],
  ["/signals", "Free Signals"],
  ["/reviews", "Reviews"],
  ["/office", "Office Location"],
  ["/contact", "Contact"],
  ["/login", "Student Login"],
  ["/admin/login", "Admin Login"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Existing navigation links are always retained.
  // Logged-in users get an additional dashboard link.
  const links = [
    ...base,
    ...(user
      ? [
          [
            home(user),
            ["admin", "superadmin"].includes(user.role)
              ? "Admin Panel"
              : ["mentor", "staff"].includes(user.role)
                ? "Staff Panel"
                : "My Dashboard",
          ],
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-dgold/30">
      <div className="w-full px-4 lg:px-5 min-h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden 2xl:flex items-center justify-center flex-1 gap-x-4">
          {links.map(([to, label], index) => (
            <NavLink
              key={`${to}-${index}`}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap text-[14px] font-medium transition-colors ${
                  isActive ? "text-gold" : "text-white/85 hover:text-gold"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden 2xl:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <Link to="/apply" className="btn-line whitespace-nowrap">
            Apply Online
          </Link>
        </div>

        {/* Tablet / Mobile Actions */}
        <div className="2xl:hidden flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            className="text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      {open && (
        <div className="2xl:hidden bg-coal border-t border-dgold/30 px-5 py-5 grid gap-4 max-h-[80vh] overflow-y-auto">
          {links.map(([to, label], index) => (
            <Link
              key={`${to}-${index}`}
              to={to}
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-gold text-sm font-medium"
            >
              {label}
            </Link>
          ))}

          <Link
            to="/apply"
            onClick={() => setOpen(false)}
            className="btn-gold text-center"
          >
            Apply Online
          </Link>

          <SocialLinks />
        </div>
      )}
    </header>
  );
}
