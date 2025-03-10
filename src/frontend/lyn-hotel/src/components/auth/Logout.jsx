import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";

import { LoginContext } from "../../App";

const Logout = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.handleLogout();
    navigate("/", { state: { message: "You have been logged out!!!" } });
    //window.location.reload();
  };
  //const isLoggedIn = localStorage.getItem("userId") !== null;
  const { isLoggedIn } = useContext(LoginContext);
  return isLoggedIn ? (
    <>
      <li>
        <Link className="dropdown-item" to={"/profile"}>
          Profile
        </Link>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>
      <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button>
    </>
  ) : null;
};

export default Logout;
