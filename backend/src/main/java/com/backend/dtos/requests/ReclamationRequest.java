package com.backend.dtos.requests;

public record ReclamationRequest(
        int  numeroCommande,
        String sujet,
        String description
) {}
