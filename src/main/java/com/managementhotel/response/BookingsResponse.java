package com.managementhotel.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingsResponse {
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
    private UserResponse userResponse;
}
