package com.managementhotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse { // đây là class dto ứng với bookedroom entity
    private Long bookingId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String guestFullName;
    private String guestEmail;
    private int numOfChildren;
    private int numOfAdults;
    private int totalNumOfGuest;
    private String bookingConfirmationCode;
    private RoomResponse roomResponse;

    //private Long userId;

}
