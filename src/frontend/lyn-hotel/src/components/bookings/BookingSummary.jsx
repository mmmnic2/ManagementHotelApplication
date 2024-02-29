import moment from "moment";
import { useState } from "react";

import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
// component để xác thực lại các thông tin đặt phòng và confirm đặt phòng
const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  //const navigate = useNavigate();
  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };
  // useEffect(() => {
  //   if (isBookingConfirmed) {
  //     navigate("/booking-success");
  //   }
  // }, [isBookingConfirmed, navigate]);

  return (
    <div className="card card-body mt-5">
      <h4 className="card card-title border border-0 align-items-center">
        Reservation Summary
      </h4>
      <p>
        FullName: <strong>{booking.guestFullName}</strong>
      </p>
      <p>
        Email: <strong>{booking.guestEmail}</strong>
      </p>
      <p>
        Check-In Date:{" "}
        <strong>{moment(booking.checkInDate).format("MM/DD/YYYY")}</strong>
      </p>
      <p>
        Check-Out Date:{" "}
        <strong>{moment(booking.checkOutDate).format("MM/DD/YYYY")}</strong>
      </p>
      <p>
        Number of Days Booked: <strong>{numOfDays}</strong>
      </p>
      <div>
        <h5>Number of Guests</h5>
        <div>
          <strong>
            Adult{booking.numOfAdults > 1 ? "s" : ""}: {booking.numOfAdults}
          </strong>
        </div>
        <div>
          <strong>Children: {booking.numOfChildren}</strong>
        </div>
      </div>
      {payment() > 0 ? (
        <>
          <p>
            Total Payment: <strong>{payment()}</strong>
          </p>
          {isFormValid && !isBookingConfirmed ? (
            <Button variant="success" onClick={handleConfirmBooking}>
              {isProcessingPayment ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Booking Confirmed, Redirecting to payment....
                </>
              ) : (
                "Confirm Booking and proceed to payment"
              )}
            </Button>
          ) : isBookingConfirmed ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading</span>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-danger">
          Check-out date must be after check-in date.{" "}
        </p>
      )}
    </div>
  );
};
BookingSummary.propTypes = {
  booking: PropTypes.object.isRequired,
  payment: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
export default BookingSummary;
