import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {ReclamationService} from '../services/reclamation.service';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Toast} from 'primeng/toast';
import {Card} from 'primeng/card';
import {Button, ButtonDirective} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {InputText} from 'primeng/inputtext';
import {ReclamationRequest} from '../models/ReclamationRequest.model';
import {ReclamationResponse} from '../models/ReclamationResponse.model';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ProgressSpinner,
    ReactiveFormsModule,
    Toast,
    Card,
    Textarea,
    InputText,
    PrimeTemplate,
    Button

  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService, ReclamationService]
})
export class UserComponent implements OnInit {
  reclamationForm: FormGroup;
  searchForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  editingTrackingId = '';

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private messageService: MessageService
  ) {
    this.reclamationForm = this.fb.group({
      numeroCommande: ['', [Validators.required, Validators.minLength(1)]],
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Ajout du formulaire de recherche
    this.searchForm = this.fb.group({
      trackingId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialisation du composant
  }

  // Créer une nouvelle réclamation
  createReclamation(): void {
    if (this.reclamationForm.valid) {
      this.isLoading = true;
      const request: ReclamationRequest = this.reclamationForm.value;

      this.reclamationService.createReclamation(request).subscribe({
        next: (response: ReclamationResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Réclamation créée avec succès. ID de tracking: ${response.trackingId}`,
            life: 5000
          });
          this.resetForm();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message || 'Une erreur est survenue',
            life: 5000
          });
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires',
        life: 3000
      });
    }
  }

  // Modifier une réclamation existante
  updateReclamation(): void {
    if (this.reclamationForm.valid && this.editingTrackingId) {
      this.isLoading = true;
      const request: ReclamationRequest = this.reclamationForm.value;

      this.reclamationService.updateReclamation(this.editingTrackingId, request).subscribe({
        next: (response: ReclamationResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Réclamation mise à jour avec succès',
            life: 5000
          });
          this.resetForm();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message || 'Une erreur est survenue',
            life: 5000
          });
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires',
        life: 3000
      });
    }
  }

  // Charger une réclamation pour modification
  loadReclamationForEdit(trackingId: string): void {
    this.isLoading = true;
    this.reclamationService.getReclamation(trackingId).subscribe({
      next: (response: ReclamationResponse) => {
        this.isEditMode = true;
        this.editingTrackingId = trackingId;
        this.reclamationForm.patchValue({
          numeroCommande: response.numeroCommande,
          sujet: response.sujet,
          description: response.description
        });
        this.isLoading = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Réclamation chargée pour modification',
          life: 3000
        });
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Une erreur est survenue',
          life: 5000
        });
        this.isLoading = false;
      }
    });
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.resetForm();
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Modification annulée',
      life: 3000
    });
  }

  // Réinitialiser le formulaire
  private resetForm(): void {
    this.reclamationForm.reset();
    this.searchForm.reset(); // Ajout pour réinitialiser aussi le formulaire de recherche
    this.isEditMode = false;
    this.editingTrackingId = '';
    this.markFormGroupUntouched();
  }

  // Marquer tous les champs comme touchés
  private markFormGroupTouched(): void {
    Object.keys(this.reclamationForm.controls).forEach(key => {
      this.reclamationForm.get(key)?.markAsTouched();
    });
  }

  // Marquer tous les champs comme non touchés
  private markFormGroupUntouched(): void {
    Object.keys(this.reclamationForm.controls).forEach(key => {
      this.reclamationForm.get(key)?.markAsUntouched();
    });
  }

  // Vérifier si un champ a une erreur
  hasError(fieldName: string): boolean {
    const field = this.reclamationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.reclamationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `Le champ ${fieldName} est requis`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Le champ ${fieldName} doit contenir au moins ${requiredLength} caractères`;
      }
    }
    return '';
  }

  editReclamation(trackingId: string): void {
    this.loadReclamationForEdit(trackingId);
  }

  // Ajout de la méthode pour rechercher depuis le formulaire
  searchReclamation(): void {
    if (this.searchForm.valid) {
      const trackingId = this.searchForm.get('trackingId')?.value;
      this.editReclamation(trackingId);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez saisir un ID de tracking',
        life: 3000
      });
    }
  }
}
