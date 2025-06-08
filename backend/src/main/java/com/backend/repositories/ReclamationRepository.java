package com.backend.repositories;

import com.backend.entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ReclamationRepository extends JpaRepository<Reclamation , Long> {
    Optional<Reclamation> findByTrackingId(UUID trackingId);

    @Query("select  r from Reclamation r order by r.id desc ")
    List<Reclamation> findAllByReclamation();

}
