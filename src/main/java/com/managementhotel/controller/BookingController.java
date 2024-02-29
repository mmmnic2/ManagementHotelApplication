package com.managementhotel.controller;

import com.managementhotel.entity.BookedRoom;
import com.managementhotel.entity.Room;
import com.managementhotel.exception.InvalidBookingRequestException;
import com.managementhotel.exception.ResourceNotFoundException;
import com.managementhotel.response.BookingResponse;
import com.managementhotel.response.RoomResponse;
import com.managementhotel.service.impl.BookingService;
import com.managementhotel.service.impl.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/bookings")

@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    private final RoomService roomService;

    @GetMapping("/all-bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking); // hàm parse booking entity to DTO
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        try {
            BookedRoom booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest) {
        try {
            String confirmationCode = bookingService.saveBooking(roomId, bookingRequest);
            return ResponseEntity.ok("Room booked successfully, Your booking confirmation code is: " + confirmationCode);
        } catch (InvalidBookingRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @DeleteMapping("/{bookingId}/delete")
    public void cancleBooking(@PathVariable Long bookingId) {
        bookingService.cancleBooking(bookingId);
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<?> getBookingsByUserEmail(@PathVariable String email){
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for(BookedRoom booked : bookings){
            bookingResponses.add(getBookingResponse(booked));
        }
        return ResponseEntity.ok(bookingResponses);

    }
    private BookingResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = roomService.getRoomById(booking.getRoom().getId()).get();
        RoomResponse room = new RoomResponse(theRoom.getId(), theRoom.getRoomType(), theRoom.getRoomPrice());
        return new BookingResponse(booking.getBookingId(), booking.getCheckInDate(),
                booking.getCheckOutDate(), booking.getGuestFullName(), booking.getGuestEmail(),
                booking.getNumOfChildren(), booking.getNumOfAdults(), booking.getTotalNumOfGuest(),
                booking.getBookingConfirmationCode(), room);
    }
}
