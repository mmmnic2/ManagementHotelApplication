package com.managementhotel.controller;

import com.managementhotel.entity.BookedRoom;
import com.managementhotel.entity.Room;
import com.managementhotel.entity.User;
import com.managementhotel.exception.InvalidBookingRequestException;
import com.managementhotel.exception.ResourceNotFoundException;
import com.managementhotel.response.BookingResponse;
import com.managementhotel.response.BookingsResponse;
import com.managementhotel.response.RoomResponse;
import com.managementhotel.response.UserResponse;
import com.managementhotel.service.impl.BookingService;
import com.managementhotel.service.impl.RoomService;
import com.managementhotel.service.impl.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
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

    // bổ sung
//    api bổ sung
    @PostMapping("/room/{roomId}/user/{userId}/booking")
    public ResponseEntity<?> saveBookings(@PathVariable Long roomId,
                                          @PathVariable Long userId,
                                          @RequestBody BookedRoom bookingRequest){
        try{
            String confirmationCode = bookingService.saveBookings(roomId, bookingRequest, userId);
            return ResponseEntity.ok("Room booked successfully, Your booking confirmation code is: " + confirmationCode);
        }catch(ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/find-bookings/user/{userId}")
    public ResponseEntity<?> findBookingByUserId(@PathVariable Long userId){
        try{
            List<BookedRoom> bookedRoomList = bookingService.findBookingsByUserId(userId);
            List<BookingResponse> bookings = new ArrayList<>();
            bookedRoomList.forEach(booking -> bookings.add(getBookingResponse(booking)));
            return ResponseEntity.ok(bookings);
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    // hết
}
