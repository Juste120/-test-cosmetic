package com.backend.dtos.requests;

public record ReclamationRequest(
        String numeroCommande,
        String sujet,
        String description
) {}
