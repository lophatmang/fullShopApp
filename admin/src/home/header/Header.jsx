import { Link } from "react-router-dom";
import classes from "./Header.module.css";

function Header() {
  return (
    <div className={classes.header}>
      <Link to="/">
        <h4>Admin Page</h4>
      </Link>
    </div>
  );
}

export default Header;
