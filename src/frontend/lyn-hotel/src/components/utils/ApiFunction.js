import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
});

export function getHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function getHeaderWithFormDaTa() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
}

/*Function này để thêm 1 room mới */
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);
  const response = await api.post("/rooms/new-room", formData, {
    headers: getHeaderWithFormDaTa(),
  });
  if (response.status == 200 || response.status == 201) {
    return true;
  }
  return false;
}
/* Function này để lấy tất cả các type room */
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room-types");
    return response.data;
  } catch (e) {
    throw new Error("Error fetching room types");
  }
}
/* this function gets all rooms from database */
export async function getAllRooms() {
  try {
    const response = await api.get("/rooms/all-rooms");
    return response.data;
  } catch (e) {
    throw new Error("Error fetching all rooms");
  }
}
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new error(`Error deleting Room ${error.message}`);
  }
}
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  console.log(formData);
  const respone = await api.put(`/rooms/update/${roomId}`, formData, {
    headers: getHeaderWithFormDaTa(),
  });
  return respone;
}

export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching room: ${error.message}`);
  }
}
/*This function saves a new booking to database*/
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking,
      {
        headers: getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}
/*Function này để sửa lại lệnh saveBook lưu luôn cả id của người dùng */
export async function booksRoom(roomId, booking, userId) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/user/${userId}/booking`,
      booking,
      { headers: getHeader() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}
//////// Endddd

/*This function get all bookings from the database  */
export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return result.data;
  } catch (e) {
    throw new Error(`Error fetching bookings: ${e.message}`);
  }
}
/*This function get a booking by confirmationCode */
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking: ${error.message}`);
    }
  }
}
/*This function delete booking by bookingId */
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`bookings/${bookingId}/delete`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error cancling booking: ${error.message}`);
  }
}
// This function get all availableroooms
//from the database with checkindate , checkoutdate and roomtype
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const data = await api.get(`rooms/available-rooms`, {
    params: {
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      roomType: roomType,
    },
  });

  return data.data;
}

export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error: ${error.message}`);
    }
  }
}

export async function loginUser(login) {
  try {
    const response = await api.post(`/auth/login`, login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserProfile(userId) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}
export async function getUser(userId) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getBookingsByUserId(userId) {
  try {
    const result = await api.get(`/bookings/find-bookings/user/${userId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking: ${error.message}`);
    }
  }
}
