import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import { useEffect } from "react";
const BookingSuccess = () => {
  // khi book phòng success sẽ direct tới component này
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;
  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div className="container">
      <Header title="Booking Success" />
      <div className="mt-5">
        {message ? (
          <div>
            <h3 className="text-success">Thank You!!!</h3>
            <p className="text-success">{message}</p>
          </div>
        ) : (
          <div>
            <h3 className="text-danger">Error Booking Room!!</h3>
            <p className="text-danger">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
