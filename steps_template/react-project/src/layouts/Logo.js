import { ReactComponent as LogoDark } from "../images/logos/adminpro.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/main">
      <LogoDark />
    </Link>
  );
};

export default Logo;
