package com.backend.services;

import com.backend.dtos.requests.ReclamationRequest;
import com.backend.dtos.responses.ReclamationResponse;

import java.util.List;
import java.util.UUID;

public interface ReclamationService {
    ReclamationResponse addReclammation(ReclamationRequest reclamationRequest);
    ReclamationResponse getReclammation(UUID trackingId);
    ReclamationResponse updateReclammation(UUID trackingId, ReclamationRequest reclamationRequest);
    void deleteReclammation(UUID trackingId);
    List<ReclamationResponse> getReclamation();

}
