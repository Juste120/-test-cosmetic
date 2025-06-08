📋 Module de Gestion des Retours et Réclamations
Description
Système web complet permettant aux clients de soumettre des réclamations ou des demandes de retour produit, et aux administrateurs de les traiter efficacement. Développé avec Angular 19 (frontend) intégrant le template Sakai et Spring Boot 3.5.0 (backend).

Technologies Utilisées
Backend

Spring Boot 3.5.0 - Framework Java principal
Spring Data JPA - Accès aux données et ORM
PostgreSQL - Base de données relationnelle
Lombok - Réduction du code boilerplate
Java 21 - Version du langage
Spring Web - API REST

Frontend

Angular 19 - Framework JavaScript
Template Sakai - Interface utilisateur moderne avec PrimeNG
TypeScript - Langage de programmation
PrimeNG - Composants UI avancés
SweetAlert2 - Notifications et confirmations élégantes
Node.js 18+ - Environnement d'exécution


Prérequis
Avant de lancer le projet, assurez-vous d'avoir installé :

Node.js (version 18 ou supérieure)
npm (inclus avec Node.js)
Java 21 (JDK)
PostgreSQL (version 12 ou supérieure)
Git


Architecture du Système
Entités Backend

Réclamation : Gestion des réclamations et retours
Client : Informations des clients
Commande : Référence aux commandes concernées

Fonctionnalités Principales

Soumission de réclamations par les clients
Gestion administrative des réclamations
Filtrage par statut (En attente, En traitement, Résolue, Rejetée)
Notifications avec SweetAlert2
Badges de statut colorés


Configuration de la Base de Données
1. Créer la base de données
sqlCREATE DATABASE cosmetic_db;
2. Configuration application.properties
Configurez les paramètres dans backend/src/main/resources/application.properties :
properties# Configuration PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/cosmetic_db
spring.datasource.username=votre_username
spring.datasource.password=votre_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuration serveur
server.port=8080
spring.application.name=reclamations-management

# Configuration CORS (pour Angular)
spring.web.cors.allowed-origins=http://localhost:4200

Instructions d'Exécution
1. Lancement du Backend (Spring Boot)
bash# Naviguer vers le dossier backend
cd backend

# Donner les permissions d'exécution (Linux/Mac)
chmod +x gradlew

# Compiler et lancer l'application
./gradlew bootRun

# Ou sur Windows
gradlew.bat bootRun
Le backend sera accessible sur : http://localhost:8080
Alternative avec IDE :

Importez le projet backend dans IntelliJ IDEA ou VS Code
Exécutez la classe principale Application.java

2. Lancement du Frontend (Angular 19)
bash# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Installer SweetAlert2
npm install sweetalert2 @types/sweetalert2

# Lancer le serveur de développement
ng serve

# Ou avec npm
npm start
Le frontend sera accessible sur : http://localhost:4200
