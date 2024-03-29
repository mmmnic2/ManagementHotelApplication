import { Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const BookingCard = ({ booking, handleBookingCancellation }) => {
  return (
    <Col className="mt-4 mx-auto" xs={5}>
      <Card>
        <Card.Body className="d-flex flex-wrap align-items-center">
          <div className="mx-auto mb-2">
            <Card.Img
              variant="top"
              src={`data:image/png;base64, ${booking.roomResponse.photo}`}
              alt="Room Photo"
              style={{ width: "100%", height: "200px" }}
            />
          </div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Room Type: </th>
                <th>{booking.roomResponse.roomType}</th>
              </tr>
              <tr>
                <th>Check-In Date: </th>
                <th>{booking.checkInDate}</th>
              </tr>
              <tr>
                <th>Check-Out Date: </th>
                <th>{booking.checkOutDate}</th>
              </tr>
              <tr>
                <th>Name Of Guest: </th>
                <th>{booking.guestFullName}</th>
              </tr>
              <tr>
                <th>Email: </th>
                <th>{booking.guestEmail}</th>
              </tr>
              <tr>
                <th>Adults: </th>
                <th>{booking.numOfAdults}</th>
              </tr>
              <tr>
                <th>Children: </th>
                <th>{booking.numOfChildren}</th>
              </tr>
              <tr>
                <th>Booking Confirmation Code: </th>
                <th>{booking.bookingConfirmationCode}</th>
              </tr>
            </tbody>
          </table>
        </Card.Body>
        <Card.Body className="mx-auto pt-0">
          <button
            className="btn btn-danger"
            onClick={() => handleBookingCancellation(booking.bookingId)}
          >
            Cancel
          </button>
        </Card.Body>
      </Card>
    </Col>
  );
};
BookingCard.propTypes = {
  booking: PropTypes.object,
  handleBookingCancellation: PropTypes.func,
};
export default BookingCard;
