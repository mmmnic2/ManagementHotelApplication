import { useState } from "react";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunction";
import moment from "moment";
const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    bookingId: "",
    roomResponse: { id: "", roomType: "" },
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
    roomResponse: { id: "", roomType: "" },
    bookingConfirmationCode: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuest: "",
  };
  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
    } catch (error) {
      setBookingInfo(clearBookingInfo);
      if (error.response && error.response.status === 404) {
        setError(error.response.data);
      } else {
        setError(error.message);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
          <div className="col-md-6 mt-5 mb-4">
            <h3>Booking Confirmation</h3>
            <p>
              Booking Confirmation Code : {bookingInfo.bookingConfirmationCode}
            </p>
            <p>Booking ID : {bookingInfo.bookingId}</p>
            <p>Room Number : {bookingInfo.roomResponse.id}</p>
            <p>Room Type : {bookingInfo.roomResponse.roomType}</p>
            <p>Check-In Date : {bookingInfo.checkInDate}</p>
            <p>Check-Out Date : {bookingInfo.checkOutDate}</p>
            <p>Full Name : {bookingInfo.guestFullName}</p>
            <p>Email : {bookingInfo.guestEmail}</p>
            <p>Adults : {bookingInfo.numOfAdults}</p>
            <p>Children : {bookingInfo.numOfChildren}</p>
            <p>Total Guest : {bookingInfo.totalNumOfGuest}</p>
            {!isDeleted && (
              <button
                className="btn btn-danger"
                onClick={() => handleBookingCancellation(bookingInfo.bookingId)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ) : (
          <div>Find Booking...</div>
        )}
        {isDeleted && (
          <div className="alert alert-success mt-3" role="alert">
            Booking has been cancelled successfully
          </div>
        )}
      </div>
    </>
  );
};

export default FindBooking;
