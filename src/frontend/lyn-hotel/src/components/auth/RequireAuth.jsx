import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("userId");
  const location = useLocation();
  if (!user) {
    return <Navigate to={`/login`} state={{ path: location.pathname }} />;
  }
  return children;
};
RequireAuth.propTypes = {
  children: PropTypes.any,
};
export default RequireAuth;
