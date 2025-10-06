const NavLinks = [
  { label: "Dashboard", authRequired: false, href: "/" },
  { label: "Waitlist", authRequired: true, href: "/waitlists" },
];

export const NonUserLinks = [
  { label: "Signup", authRequired: false, href: "/auth/register" },
  { label: "Login", authRequired: false, href: "/auth/login" },
];

export default NavLinks;
