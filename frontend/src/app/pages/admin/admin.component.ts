import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';

// PrimeNG Services
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { ReclamationService } from '../services/reclamation.service';
import { ReclamationResponse } from '../models/ReclamationResponse.model';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    ProgressSpinnerModule,
    DialogModule,
    ScrollPanelModule,
    Tooltip
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;

  reclamations: ReclamationResponse[] = [];
  loading = false;
  selectedReclamation: ReclamationResponse | null = null;
  displayDialog = false;

  // Filtrage
  statuses = [
    { label: 'Tous', value: null },
    { label: 'En attente', value: false },
    { label: 'Validées', value: true }
  ];
  selectedStatus: any = null;
  searchValue = '';

  private destroy$ = new Subject<void>();

  constructor(
    private reclamationService: ReclamationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReclamations(): void {
    this.loading = true;
    this.reclamationService.getAllReclamations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.reclamations = data;
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `${data.length} réclamation(s) chargée(s)`
          });
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message
          });
        }
      });
  }

  validateReclamation(reclamation: ReclamationResponse): void {
    if (reclamation.validate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Cette réclamation est déjà validée'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir valider la réclamation ${reclamation.trackingId} ?`,
      header: 'Confirmer la validation',
      icon: 'pi pi-check-circle',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.reclamationService.validateReclamation(reclamation.trackingId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (updatedReclamation) => {
              const index = this.reclamations.findIndex(r => r.trackingId === reclamation.trackingId);
              if (index !== -1) {
                this.reclamations[index] = updatedReclamation;
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Validation réussie',
                detail: `Réclamation ${reclamation.trackingId} validée avec succès`
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur de validation',
                detail: error.message
              });
            }
          });
      }
    });
  }

  refuseReclamation(reclamation: ReclamationResponse): void {
    if (reclamation.validate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Impossible de supprimer une réclamation validée'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir refuser et supprimer la réclamation ${reclamation.trackingId} ?`,
      header: 'Confirmer le refus',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.reclamationService.deleteReclamation(reclamation.trackingId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.reclamations = this.reclamations.filter(r => r.trackingId !== reclamation.trackingId);
              this.messageService.add({
                severity: 'success',
                summary: 'Suppression réussie',
                detail: `Réclamation ${reclamation.trackingId} supprimée avec succès`
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur de suppression',
                detail: error.message
              });
            }
          });
      }
    });
  }

  viewReclamationDetails(reclamation: ReclamationResponse): void {
    this.selectedReclamation = reclamation;
    this.displayDialog = true;
  }

  getStatusSeverity(validate: boolean): string {
    return validate ? 'success' : 'warning';
  }

  getStatusLabel(validate: boolean): string {
    return validate ? 'Validée' : 'En attente';
  }

  refreshData(): void {
    this.loadReclamations();
  }

  // Méthodes de filtrage pour le template
  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }
}
