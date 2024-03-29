import "../node_modules/popper.js/dist/popper.min.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { createContext, useEffect, useState } from "react";
import ExistingRoom from "./components/room/ExistingRoom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import EditRoom from "./components/room/EditRoom";
import AddRoom from "./components/room/AddRoom";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import RoomListing from "./components/room/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/bookings/Checkout";
import BookingSuccess from "./components/bookings/BookingSuccess";
import Bookings from "./components/bookings/Bookings";
import FindBooking from "./components/bookings/FindBooking";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import { AuthProvider } from "./components/auth/AuthProvider";
import Logout from "./components/auth/Logout";
import RequireAuth from "./components/auth/RequireAuth";
import FindMyBooking from "./components/bookings/FindMyBooking.jsx";
export const LoginContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);
  useEffect(() => {
    // Kiểm tra xem có dữ liệu trong Local Storage không
    const storedIsLoggedIn = localStorage.getItem("userId");
    const userId = localStorage.getItem("id");
    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setId(userId);
    }
  }, []); // Chỉ chạy một lần khi component được render lần đầu tiên
  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, id, setId }}>
      <AuthProvider>
        <main>
          <Router>
            <NavBar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit-room/:roomId" element={<EditRoom />} />
              <Route path="/existing-rooms" element={<ExistingRoom />} />
              <Route path="/add-room" element={<AddRoom />} />
              <Route path="/browse-all-rooms" element={<RoomListing />} />
              <Route path="/admin" element={<Admin />} />

              <Route
                path="/book-room/:roomId"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />

              <Route path="/booking-success" element={<BookingSuccess />} />

              <Route path="/existing-bookings" element={<Bookings />} />
              {/* <Route path="/find-booking" element={<FindBooking />} /> */}
              <Route
                path="/find-booking"
                element={
                  <RequireAuth>
                    <FindMyBooking />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Router>
          <Footer />
        </main>
      </AuthProvider>
    </LoginContext.Provider>
  );
}

export default App;
