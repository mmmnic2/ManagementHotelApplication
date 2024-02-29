package com.managementhotel.repository;

import com.managementhotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("select distinct r.roomType from Room r")
    List<String> findDistinctRoomTypes();

    Optional<Room> getRoomById(Long roomId);

    @Query("SELECT r FROM Room r " +
            "WHERE LOWER(r.roomType) LIKE LOWER(CONCAT('%', :roomType, '%'))" +
            "AND r.id NOT IN (SELECT br.room.id FROM BookedRoom br " +
            "WHERE ((br.checkInDate <= :checkOutDate) AND (br.checkOutDate >= :checkInDate)))")
    List<Room> findAvailableRoomsByDatesAndRoomType(@Param("checkInDate") LocalDate checkInDate,
                                                    @Param("checkOutDate") LocalDate checkOutDate,
                                                    @Param("roomType") String roomType);
}
