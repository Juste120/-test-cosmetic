package com.backend.mappers;

import com.backend.dtos.requests.ReclamationRequest;
import com.backend.dtos.responses.ReclamationResponse;
import com.backend.entities.Reclamation;
import com.backend.repositories.CommandeRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ReclamationMapper {

    private final CommandeRepository commandeRepository;

    public ReclamationMapper(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    public Reclamation toEntity(ReclamationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La demande de réclamation est null");
        }

        Reclamation reclamation = new Reclamation();
        reclamation.setTrackingId(UUID.randomUUID());
        reclamation.setSujet(request.sujet());
        reclamation.setDescription(request.description());

        int numeroCommande = Integer.parseInt(request.numeroCommande());
        reclamation.setCommande(
                commandeRepository.findByNumeroCommande(numeroCommande)
                        .orElseThrow(() -> new IllegalArgumentException("Commande introuvable avec le numéro : " + numeroCommande))
        );


        return reclamation;
    }

    public ReclamationResponse toResponse(Reclamation reclamation) {
        if (reclamation == null) {
            throw new IllegalArgumentException("L'entité Réclamation est null");
        }

        return new ReclamationResponse(
                reclamation.getTrackingId(),
                String.valueOf(reclamation.getCommande().getNumeroCommande()),
                reclamation.getSujet(),
                reclamation.getDescription()
        );
    }

    public static Reclamation toEntityFromResponse(ReclamationResponse response) {
        if (response == null) {
            throw new IllegalArgumentException("La réponse Réclamation est null");
        }

        Reclamation reclamation = new Reclamation();
        reclamation.setTrackingId(response.trackingId());
        reclamation.setSujet(response.sujet());
        reclamation.setDescription(response.description());
        return reclamation;
    }
}
