package com.backend.controllers;

import com.backend.dtos.requests.ReclamationRequest;
import com.backend.dtos.responses.ReclamationResponse;
import com.backend.services.ReclamationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "*")
public class ReclamationController {

    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }



    @PostMapping
    public ResponseEntity<?> createReclamation( @RequestBody ReclamationRequest reclamationRequest) {
        try {
            System.out.println("Requête reçue: " + reclamationRequest);
            ReclamationResponse response = reclamationService.addReclammation(reclamationRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.err.println("Erreur IllegalArgumentException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur générale: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne: " + e.getMessage());
        }
    }

    @GetMapping("/{trackingId}")
    public ResponseEntity<ReclamationResponse> getReclamation(@PathVariable UUID trackingId) {
        try {
            ReclamationResponse response = reclamationService.getReclammation(trackingId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<ReclamationResponse>> getAllReclamations() {
        try {
            List<ReclamationResponse> responses = reclamationService.getReclamation();
            return new ResponseEntity<>(responses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{trackingId}")
    public ResponseEntity<ReclamationResponse> updateReclamation(
            @PathVariable UUID trackingId,
            @RequestBody ReclamationRequest reclamationRequest) {
        try {
            ReclamationResponse response = reclamationService.updateReclammation(trackingId, reclamationRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{trackingId}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable UUID trackingId) {
        try {
            reclamationService.deleteReclammation(trackingId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{trackingId}/validate")
    public ResponseEntity<?> validateReclamation(@PathVariable UUID trackingId) {
        try {
            ReclamationResponse response = reclamationService.validateReclamation(trackingId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne: " + e.getMessage());
        }
    }
}