package com.managementhotel.service.impl;

import com.managementhotel.entity.BookedRoom;
import com.managementhotel.entity.Room;
import com.managementhotel.exception.InvalidBookingRequestException;
import com.managementhotel.exception.ResourceNotFoundException;
import com.managementhotel.repository.BookedRoomRepository;
import com.managementhotel.repository.RoomRepository;
import com.managementhotel.repository.UserRepository;
import com.managementhotel.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService implements IBookingService {
    @Autowired
    private BookedRoomRepository bookedRoomRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

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

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        //nếu có 1 trong các existingBooking trả về true thì hàm sẽ return về false
        // => bắt buộc tất cả các existingBooking phải không match với điều kiện đưa ra thì mới đúng
        return existingBookings.stream().noneMatch(
                existingBooking -> bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                        || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                        || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate()) && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                        || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                        || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate()) && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
                        || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate()) && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))
                        || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate()) && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))

        );
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookedRoomRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No Booking Found With Booking Code:" + confirmationCode));
    }


}
