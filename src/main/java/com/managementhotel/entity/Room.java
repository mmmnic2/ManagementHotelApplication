package com.managementhotel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomType;
    private BigDecimal roomPrice;
    private boolean isBooked = false;
    @Lob
    private Blob photo;
    // fech lazy nghĩa là khi gọi tới bra
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedRoom> bookings = new ArrayList<>();

    //phương thức đặt phòng
    public void addBooking(BookedRoom booking){
        if(this.bookings == null){
            this.bookings = new ArrayList<>();
        }
        // add booking vào listBooking của room
        this.bookings.add(booking);
        // add room vào booking
        booking.setRoom(this);
        // phòng đã được đặt => isBooked = true
        this.isBooked = true;
        //random ra một chuỗi code để đưa vào code booking
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }

}
