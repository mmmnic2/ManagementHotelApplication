import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import { getRoomById } from "../utils/ApiFunction";
import { useParams } from "react-router-dom";
import {
  FaCar,
  FaCocktail,
  FaParking,
  FaTshirt,
  FaTv,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import RoomCarousel from "../common/RoomCarousel";
//component để render booking form và information của room đang đc book
const Checkout = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfor, setRoomInfor] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
  });
  const { roomId } = useParams();
  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfor(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }, 1500);
  }, [roomId]);

  return (
    <div>
      <section className="container">
        <div className="row">
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p>Loading room information...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="room-info">
                <img
                  src={`data:image/png;base64, ${roomInfor.photo}`}
                  alt="Room Photo"
                  style={{ width: "100%", height: "200px" }}
                />
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Room Type: </th>
                      <th>{roomInfor.roomType}</th>
                    </tr>
                    <tr>
                      <th>Room Price: </th>
                      <th>{roomInfor.roomPrice}</th>
                    </tr>
                    <tr>
                      <th>Room Services: </th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> WiFi
                          </li>
                          <li>
                            <FaTv />
                            Netflix Premium
                          </li>
                          <li>
                            <FaUtensils /> Breakfast
                          </li>
                          <li>
                            {" "}
                            <FaTshirt /> Laundry
                          </li>
                          <li>
                            <FaCocktail /> Mini-bar refreshment
                          </li>
                          <li>
                            <FaCar />
                            Car Service
                          </li>
                          <li>
                            <FaParking /> Parking
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <div className="container">
        <RoomCarousel />
      </div>
    </div>
  );
};

export default Checkout;
