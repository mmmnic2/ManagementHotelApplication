import { useState, useEffect } from "react";
import { cancelBooking, getAllBookings } from "../utils/ApiFunction";
import Header from "../common/Header";
import BookingsTable from "./BookingsTable";
//component cho admin để manage all bookings
const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchAllBookings = async () => {
    const data = await getAllBookings();
    console.log(data);
  };
  useEffect(() => {
    fetchAllBookings();
    setIsLoading(true);
    getAllBookings()
      .then((data) => {
        setBookingInfo(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);
  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const data = await getAllBookings();
      setBookingInfo(data);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <section style={{ backgroundColor: "whitesmoke" }}>
      <Header title={"Existing Bookings"} />
      {error && <div className="text-danger">{error}</div>}
      {isLoading ? (
        <div>Loading Existing Bookings...</div>
      ) : (
        <BookingsTable
          bookingInfo={bookingInfo}
          handleBookingCancellation={handleBookingCancellation}
        />
      )}
    </section>
  );
};

export default Bookings;
