import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsMenuOpen(false); // Close menu after logout
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <h1>ManisbyMariya</h1>
      
      {/* Hamburger menu */}
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={isMenuOpen ? "active" : ""}>
        <li>
          <Link to="" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="all-nails" onClick={closeMenu}>All Appointments</Link>
        </li>
        {user && (
          <li>
            <Link to="my-bookings" onClick={closeMenu}>My Bookings</Link>
          </li>
        )}
        {user == null ? (
          <li>
            <Link to="auth" onClick={closeMenu}>Login</Link>
          </li>
        ) : (
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;