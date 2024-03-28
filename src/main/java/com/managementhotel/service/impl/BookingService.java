package com.managementhotel.service.impl;

import com.managementhotel.entity.BookedRoom;
import com.managementhotel.entity.Room;
import com.managementhotel.entity.User;
import com.managementhotel.exception.InvalidBookingRequestException;
import com.managementhotel.exception.ResourceNotFoundException;
import com.managementhotel.repository.BookedRoomRepository;
import com.managementhotel.repository.RoomRepository;
import com.managementhotel.repository.UserRepository;
import com.managementhotel.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final BookedRoomRepository bookedRoomRepository;

    private final RoomRepository roomRepository;

    private final UserRepository userRepository;

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookedRoomRepository.findAll();
    }

    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookedRoomRepository.findByRoomId(roomId);
    }

    @Override
    public List<BookedRoom> getBookingsByUserEmail(String email) {
        return bookedRoomRepository.findBookedRoomByGuestEmail(email);
    }

    @Override
    public void cancleBooking(Long bookingId) {
        bookedRoomRepository.deleteById(bookingId);
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Room room = roomRepository.getRoomById(roomId).get();
        List<BookedRoom> existingBookings = room.getBookings();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingBookings);
        if (roomIsAvailable) {
            room.addBooking(bookingRequest);
            bookedRoomRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("Sorry!!! This room is not available for  the selected dates");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    private boolean checkRoomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        //nếu có 1 trong các existingBooking trả về true thì hàm sẽ return về false
        // => bắt buộc tất cả các existingBooking phải không match với điều kiện đưa ra thì mới đúng
        return existingBookings.stream().noneMatch(
                // dòng 1 kiểm tra xem checkInDate có trùng với checkInDate của booking đã tồn tại trong list chưa?
                existingBooking -> bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                        // dòng 2 kiểm tr xem checkOutDate có trước
                        || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                        // kiểm tra trường hợp đặt sau ngày của booking đã có nhưng thời gian đặt phòng lại trước thời gian trả phòng của booking
                        || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate()) && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                        // kiểm tra trường hợp đặt trước ngày của booking đã có nhưng thời gian trả phòng lại trùng với thời gian trả phòng của booking đã có
                        || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                        // kiểm tra trường hợp đặt phòng trước existBooking nhưng lại trả phòng sau ngày existing booking trả phòng
                        || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
                        // kiểm tra thêm trường hợp checkInDate
                        //|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate()) && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
                        //|| (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate()) && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))

        );
    }
    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings){
        return existingBookings.stream().noneMatch(
                existingBooking -> bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                        || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate()) && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                        || (bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate()))
                        || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))


        );
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookedRoomRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No Booking Found With Booking Code:" + confirmationCode));
    }


    // API test cho code mới

    //hàm getAllBookings() không cần thay đổi

    // hàm getAllBookingsByRoomId(Long roomId) không cần thay đổi
    // hàm cancelBooking() không cần thay đổi
    // Viết lại hàm saveBooking(roomId, bookingsResponse, userId)
    public String saveBookings(Long roomId, BookedRoom bookingRequest, Long userId) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        if(!userRepository.existsById(userId)){
            throw new ResourceNotFoundException("Id user is not exists");
        }
        Room room = roomRepository.getRoomById(roomId).get();
        List<BookedRoom> existingBookings = room.getBookings();
        User user = userRepository.findById(userId).get();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingBookings);
        if (roomIsAvailable) {
            room.addBooking(bookingRequest);
            user.addBooking(bookingRequest);
            bookedRoomRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("Sorry!!! This room is not available for  the selected dates");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    //Viết thêm ham findByUserId
    public List<BookedRoom> findBookingsByUserId(Long userId){
        if(!userRepository.existsById(userId)){
            throw new ResourceNotFoundException("user id is not exists");
        }
        return bookedRoomRepository.findBookedRoomByUserId(userId);
    }
}
