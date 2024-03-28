package com.managementhotel.repository;

import com.managementhotel.entity.BookedRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookedRoomRepository extends JpaRepository<BookedRoom, Long> {
    Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);
    List<BookedRoom> findBookedRoomByGuestEmail(String email);
    List<BookedRoom> findByRoomId(Long roomId);
    //mới thêm vào
    List<BookedRoom> findBookedRoomByUserId(Long userId);
}
