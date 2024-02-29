import { useState, useEffect } from "react";
import { deleteRoom, getAllRooms } from "../utils/ApiFunction";
import RoomFilter from "../common/RoomFilter";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  //filteredRooms là mảng chứa các room cần để hiển thị trên browser
  const [filteredRooms, setFilteredRooms] = useState([]);
  //selectedRoomType là hàm chứa type người dùng chọn
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchRooms = async () => {
    //hàm fetchroom để get toàn bộ room trong database
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      console.log(result);
      setRooms(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      //hàm này lọc ra cái room có roomtype giống như type mà người dùng chọn
      const filtered = rooms.filter(
        (room) => room.roomType === selectedRoomType
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);
  const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
    // nếu fillteredRooms.length = 0 => người dùng muốn xem tất cả các phòng
    // => totalRooms(room cần hiển thị lên web) = rooms.length
    // còn nếu fillteredRooms.length > 0 => người dùng có chọn filter hiển thị
    const totalRooms =
      filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  //currentRooms dùng để hiển thị các room ở page hiện tại
  // .slice => lấy từ vị trí indexOfFirstRoom đến vị trị indexOfLastRoom -1
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId);
      if (result === "") {
        setSuccessMessage(`Room No.${roomId} was delete`);
        fetchRooms(); //khi xóa thành công thì sẽ render lại room để hiển thị
      } else {
        console.error(`Error deleting room: ${result.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);
  };
  return (
    <>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {isLoading ? (
        <p>Loading existing rooms</p>
      ) : (
        <div>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-center mb-3 mt-5">
              <h2>Existing rooms</h2>
            </div>
            <Row>
              <Col md={6} className="d-flex mb-3 mb-md-0">
                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                <Link to={"/add-room"}>
                  <FaPlus /> Add Room
                </Link>
              </Col>
            </Row>
            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room) => (
                  <tr key={room.id} className="text-center">
                    <td>{room.id}</td>
                    <td>{room.roomType}</td>
                    <td>{room.roomPrice}</td>
                    <td className="gap-2">
                      <Link to={`/edit-room/${room.id}`}>
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(room.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <RoomPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(
                filteredRooms,
                roomsPerPage,
                rooms
              )}
              onPageChange={handlePaginationClick}
            />
          </section>
        </div>
      )}
    </>
  );
};

export default ExistingRoom;
