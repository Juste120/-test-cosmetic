package com.backend.dtos.responses;

import java.util.UUID;

public record ReclamationResponse(
        UUID trackingId,
        String numeroCommande,
        String sujet,
        String description,
        Boolean validate
) {}
