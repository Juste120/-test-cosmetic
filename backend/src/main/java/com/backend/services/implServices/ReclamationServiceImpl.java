package com.backend.services.implServices;

import com.backend.dtos.requests.ReclamationRequest;
import com.backend.dtos.responses.ReclamationResponse;
import com.backend.entities.Reclamation;
import com.backend.mappers.ReclamationMapper;
import com.backend.repositories.ReclamationRepository;
import com.backend.services.ReclamationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReclamationServiceImpl implements ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ReclamationMapper reclamationMapper;

    public ReclamationServiceImpl(ReclamationRepository reclamationRepository,
                                  ReclamationMapper reclamationMapper) {
        this.reclamationRepository = reclamationRepository;
        this.reclamationMapper = reclamationMapper;
    }

    @Override
    public ReclamationResponse addReclammation(ReclamationRequest reclamationRequest) {
        if (reclamationRequest == null) {
            throw new IllegalArgumentException("La demande de réclamation ne peut pas être null");
        }

        Reclamation reclamation = reclamationMapper.toEntity(reclamationRequest);
        Reclamation savedReclamation = reclamationRepository.save(reclamation);

        return reclamationMapper.toResponse(savedReclamation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReclamationResponse getReclammation(UUID trackingId) {
        if (trackingId == null) {
            throw new IllegalArgumentException("Le trackingId ne peut pas être null");
        }

        Reclamation reclamation = reclamationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Aucune réclamation trouvée avec ce trackingId"));

        return reclamationMapper.toResponse(reclamation);
    }

    @Override
    public ReclamationResponse updateReclammation(UUID trackingId, ReclamationRequest reclamationRequest) {
        if (trackingId == null) {
            throw new IllegalArgumentException("Le trackingId ne peut pas être null");
        }
        if (reclamationRequest == null) {
            throw new IllegalArgumentException("La demande de réclamation ne peut pas être null");
        }

        Reclamation existingReclamation = reclamationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Aucune réclamation trouvée avec ce trackingId"));

        existingReclamation.setSujet(reclamationRequest.sujet());
        existingReclamation.setDescription(reclamationRequest.description());

        if (!String.valueOf(existingReclamation.getCommande().getNumeroCommande()).equals(reclamationRequest.numeroCommande())) {
            Reclamation tempReclamation = reclamationMapper.toEntity(reclamationRequest);
            existingReclamation.setCommande(tempReclamation.getCommande());
        }

        Reclamation updatedReclamation = reclamationRepository.save(existingReclamation);

        return reclamationMapper.toResponse(updatedReclamation);
    }

    @Override
    public void deleteReclammation(UUID trackingId) {
        if (trackingId == null) {
            throw new IllegalArgumentException("Le trackingId ne peut pas être null");
        }

        Reclamation reclamation = reclamationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Aucune réclamation trouvée avec ce trackingId"));

        reclamationRepository.delete(reclamation);
    }

    @Override
    public List<ReclamationResponse> getReclamation() {
        return reclamationRepository.findAll()
                .stream()
                .map(reclamationMapper::toResponse)
                .toList();
    }

    @Override
    public ReclamationResponse validateReclamation(UUID trackingId) {
        if (trackingId == null) {
            throw new IllegalArgumentException("Le trackingId ne peut pas être null");
        }

        Reclamation reclamation = reclamationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Réclamation introuvable avec l'ID : " + trackingId));

        // Vérifier si la réclamation n'est pas déjà validée
        if (Boolean.TRUE.equals(reclamation.getValidate())) {
            throw new IllegalArgumentException("Cette réclamation est déjà validée");
        }

        reclamation.setValidate(true);
        Reclamation savedReclamation = reclamationRepository.save(reclamation);

        return reclamationMapper.toResponse(savedReclamation);
    }

}