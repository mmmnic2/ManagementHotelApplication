import { useState, useEffect } from "react";
import { getRoomTypes } from "../utils/ApiFunction";
import PropTypes from "prop-types";
const RoomTypeSelector = ({ handleInputChange, newRoom }) => {
  //const { handleInputChange, newRoom } = this.props;
  const [roomTypes, setRoomTypes] = useState([]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  useEffect(() => {
    getRoomTypes().then((data) => {
      setRoomTypes(data);
    });
  }, []);
  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };
  const handleAddNewRoomType = () => {
    if (newRoomType !== "") {
      setRoomTypes([...roomTypes, newRoomType]);
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
    }
  };

  return (
    <>
      {roomTypes.length >= 0 && (
        <div>
          <select
            className="form-select"
            name="roomType"
            id="roomType"
            value={newRoom.roomType}
            onChange={(e) => {
              if (e.target.value === "Add New") {
                setShowNewRoomTypeInput(true);
              } else {
                setShowNewRoomTypeInput(false);
                handleInputChange(e);
              }
            }}
          >
            <option value={""}>selec a room type</option>
            <option value={"Add New"}>Add New</option>
            {roomTypes.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
          {showNewRoomTypeInput && (
            <div className="input-group mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a new room type"
                onChange={handleNewRoomTypeInputChange}
              />
              <button
                className="btn btn-hotel"
                type="button"
                onClick={handleAddNewRoomType}
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
RoomTypeSelector.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  newRoom: PropTypes.object.isRequired,
};

export default RoomTypeSelector;
