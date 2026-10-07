import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, useThunderID } from "@thunderid/react";
import Logo from "./Logo";
import useAccessTokenClaims from "../auth/useAccessTokenClaims";

function UserChip() {
  const claims = useAccessTokenClaims();
  // given_name and family_name only appear once they are added to the access
  // token on the application's Token tab in the Console.
  const name =
    [claims?.given_name, claims?.family_name].filter(Boolean).join(" ") ||
    claims?.username ||
    "Traveler";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="user-chip">
      <span className="avatar">{initials}</span>
      {name}
    </span>
  );
}

export default function Header() {
  // signIn() sends the browser to Gate, ThunderID's hosted sign-in pages.
  // signOut() ends the session and brings the browser back here.
  const { signIn, signOut } = useThunderID();

  return (
    <header className="header">
      <NavLink to="/" className="brand">
        <Logo />
        <span>Acme Travel</span>
      </NavLink>
      <nav className="nav">
        <NavLink to="/" end>
          Explore
        </NavLink>
        <NavLink to="/trips">My trips</NavLink>
      </nav>
      <div className="user">
        <SignedIn>
          <UserChip />
          <button className="btn btn-ghost" onClick={() => signOut()}>
            Sign out
          </button>
        </SignedIn>
        <SignedOut>
          <button className="btn" onClick={() => signIn()}>
            Sign in
          </button>
        </SignedOut>
      </div>
    </header>
  );
}
