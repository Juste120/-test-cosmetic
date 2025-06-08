package com.backend.repositories;

import com.backend.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface CommandeRepository extends JpaRepository<Commande, Long> {

    Optional<Commande> findByTrackingId(UUID trackingId);

    Optional<Commande> findByNumeroCommande(int numeroCommande);
}
