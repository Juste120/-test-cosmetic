import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ReclamationRequest } from '../models/ReclamationRequest.model';
import { ReclamationResponse } from '../models/ReclamationResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private readonly apiUrl = `${environment.apiUrl}/reclamations`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle réclamation
  createReclamation(request: ReclamationRequest): Observable<ReclamationResponse> {
    return this.http.post<ReclamationResponse>(this.apiUrl, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer une réclamation par son ID de tracking
  getReclamation(trackingId: string): Observable<ReclamationResponse> {
    return this.http.get<ReclamationResponse>(`${this.apiUrl}/${trackingId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer toutes les réclamations
  getAllReclamations(): Observable<ReclamationResponse[]> {
    return this.http.get<ReclamationResponse[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour une réclamation
  updateReclamation(trackingId: string, request: ReclamationRequest): Observable<ReclamationResponse> {
    return this.http.put<ReclamationResponse>(`${this.apiUrl}/${trackingId}`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supprimer une réclamation
  deleteReclamation(trackingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${trackingId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Valider une réclamation
  validateReclamation(trackingId: string): Observable<ReclamationResponse> {
    return this.http.patch<ReclamationResponse>(`${this.apiUrl}/${trackingId}/validate`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données saisies.';
          break;
        case 404:
          errorMessage = 'Réclamation non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur.';
          break;
        default:
          errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
