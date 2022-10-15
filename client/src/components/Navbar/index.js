import "./Navbar.scss";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <Link className="navbar__brand">empath.<span>ly</span></Link>
            <div className="navbar__items">
                <Link to="/" style={{ color: document.location.pathname === "/" ? "#4FAFC9" : "inherit" }} className="navbar__items__item">Home</Link>
                <Link to="/about" style={{ color: document.location.pathname === "/about" ? "#4FAFC9" : "inherit" }} className="navbar__items__item">About</Link>
                <Link to="/contact" style={{ color: document.location.pathname === "/contact" ? "#4FAFC9" : "inherit" }} className="navbar__items__item">Contact-us</Link>
            </div>
        </div>
    );
};

export default Navbar;