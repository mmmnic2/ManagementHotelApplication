package com.managementhotel.service;

import com.managementhotel.entity.BookedRoom;

import java.util.List;

public interface IBookingService {
    void cancleBooking(Long bookingId);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> getAllBookings();

    List<BookedRoom> getAllBookingsByRoomId(Long roomId);

    List<BookedRoom> getBookingsByUserEmail(String email);

}
