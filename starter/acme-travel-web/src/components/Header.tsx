import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
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
        <span className="user-chip">Guest</span>
      </div>
    </header>
  );
}
