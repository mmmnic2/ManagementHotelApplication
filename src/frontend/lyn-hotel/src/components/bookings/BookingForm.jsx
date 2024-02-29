import { useState } from "react";
import { bookRoom, getRoomById } from "../utils/ApiFunction";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, FormControl } from "react-bootstrap";
import moment from "moment";
import BookingSummary from "./BookingSummary";
// form nhập thông tin book room
const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);

  const currentUser = localStorage.getItem("userId");

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });

    setErrorMessage("");
  };
  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);
  const calculatePayment = () => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, "days");
    const paymentPerDay = roomPrice ? roomPrice : 0;
    return diffInDays * paymentPerDay;
  };
  const isGuestValid = () => {
    const adultCount = parseInt(booking.numOfAdults);
    const childrenCount = parseInt(booking.numOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };
  const isCheckOutDateValid = () => {
    if (
      !moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))
    ) {
      setErrorMessage("Check-out date must come before check-in date");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget; // lấy dc sự kiện ngay tại thẻ form, nếu dùng e.target => sẽ là button
    if (
      // method checkValidity để kiểm tra xem tất cả các input trong form có hợp lệ hay không
      // chẳng hạn như thuộc tính required, kiểu dữ liệu, giá trị tối thiểu, giá trị tối đa, v.v.
      form.checkValidity() === false ||
      !isGuestValid() ||
      !isCheckOutDateValid()
    ) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setIsValidated(true);
  };

  const handleBooking = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmationCode } });
    } catch (e) {
      navigate("/booking-success", { state: { error: e.message } });
    }
  };
  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-body mt-5">
              <h4 className="card card-title border border-0 align-items-center">
                Reserve Room
              </h4>
              <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="guestFullName">FullName:</Form.Label>
                  <FormControl
                    required
                    type="text"
                    id="guestFullName"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your full name
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="guestEmail">Email:</Form.Label>
                  <FormControl
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your email address
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend className=" mt-2">Lodging period</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="checkInDate">
                        Check-In date:
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        placeholder="check-in date"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check-in date
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label htmlFor="checkOutDate">
                        Check-Out date:
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        placeholder="check-out date"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check-out date
                      </Form.Control.Feedback>
                    </div>
                    {errorMessage && (
                      <p className="error-message text-danger">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mt-2">Number of Guest</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="numOfAdults">Adults :</Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfAdults"
                        name="numOfAdults"
                        value={booking.numOfAdults}
                        placeholder="0"
                        min={1}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select at least 1 adult.
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label htmlFor="numOfChildren">
                        Children :
                      </Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfChildren"
                        name="numOfChildren"
                        value={booking.numOfChildren}
                        placeholder="0"
                        min={0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
                <div className="form-group mt-2 mb-2 d-flex justify-content-center">
                  <button type="submit" className="btn btn-hotel ">
                    Continue
                  </button>
                </div>
              </Form>
            </div>
          </div>

          <div className="col-md-6">
            {isSubmitted && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment}
                isFormValid={isValidated}
                onConfirm={handleBooking}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
