import { useState, useEffect, useContext } from "react";
import { cancelBooking, getBookingsByUserId } from "../utils/ApiFunction";
import { LoginContext } from "../../App";
import { Row } from "react-bootstrap";
import BookingCard from "./BookingCard";
const FindMyBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [bookingInfo, setBookingInfo] = useState({
    bookingId: "",
    roomResponse: { id: "", roomType: "", photo: "" },
    bookingConfirmationCode: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuest: "",
  });
  const clearBookingInfo = {
    bookingId: "",
    roomResponse: { id: "", roomType: "", photo: "" },
    bookingConfirmationCode: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuest: "",
  };
  const { id } = useContext(LoginContext);
  useEffect(() => {
    getBookingsByUserId(id)
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const data = await getBookingByConfirmationCode(confirmationCode);
  //     setBookingInfo(data);
  //   } catch (error) {
  //     setBookingInfo(clearBookingInfo);
  //     if (error.response && error.response.status === 404) {
  //       setError(error.response.data);
  //     } else {
  //       setError(error.message);
  //     }
  //   }
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (confirmationCode !== "") {
      const searchBooking = bookings.find(
        (booking) => booking.bookingConfirmationCode === confirmationCode
      );

      if (searchBooking) {
        console.log(searchBooking);
        setBookingInfo(searchBooking);
      } else {
        setError(`No Booking Found With Booking Code:" ${confirmationCode}`);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setIsDeleted(true);
      setBookingInfo(clearBookingInfo);
      setConfirmationCode("");
      setError("");
    } catch (error) {
      setIsDeleted(error.message);
    }
    setTimeout(() => {
      setIsDeleted(false);
    }, 1500);
  };
  return (
    <>
      {isDeleted && (
        <div className="alert alert-success mt-3" role="alert">
          Booking has been cancelled successfully
        </div>
      )}
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2>Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter the booking confirmation codde"
            />
            <button className="btn btn-hotel input-group-text">
              Find Booking
            </button>
          </div>
        </form>
        {isLoading ? (
          <div>Finding Your Booking...</div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : bookingInfo.bookingConfirmationCode ? (
          <BookingCard
            booking={bookingInfo}
            handleBookingCancellation={handleBookingCancellation}
          />
        ) : (
          <div>
            <Row className="d-flex justity-content-center">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  handleBookingCancellation={handleBookingCancellation}
                />
              ))}
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default FindMyBooking;
