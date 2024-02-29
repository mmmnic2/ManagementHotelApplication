package com.managementhotel.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class BookedRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    @Column(name = "check_In")
    private LocalDate checkInDate;
    @Column(name = "check_Out")
    private LocalDate checkOutDate;
    @Column(name = "guest_FullName")
    private String guestFullName;
    @Column(name = "guest_Email")
    private String guestEmail;
    @Column(name = "children")
    private int numOfChildren;
    @Column(name = "adults")
    private int numOfAdults;
    @Column(name = "total_Guest")
    private int totalNumOfGuest;
    @Column(name = "confirmation_Code")
    private String bookingConfirmationCode;
    //một phòng có thể có nhiều lượt book và 1 lượt book chỉ có thể book 1 phòng =>
    // quan hệ giữa room và bookedroom là 1 - n
    // => ở đây ta sẽ dùng @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    // hàm tính tổng số khách book phòng
    public void calculateTotalNumberOfGuest() {
        this.totalNumOfGuest = this.numOfAdults + this.numOfChildren;
    }

    //mỗi khi thay đổi số lượng người lớn hoặc children => kết quả tổng số khách thay đổi
    // => cần gọi lại hàm khi thực hiện setter

    public void setNumOfChildren(int numOfChildren) {
        this.numOfChildren = numOfChildren;
        calculateTotalNumberOfGuest();
    }

    public void setNumOfAudults(int numOfAdults) {
        this.numOfAdults = numOfAdults;
        calculateTotalNumberOfGuest();
    }

    public void setBookingConfirmationCode(String bookingConfirmationCode) {
        this.bookingConfirmationCode = bookingConfirmationCode;
    }
}
