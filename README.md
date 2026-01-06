📱 Application Mobile de Réservation de Costumes
🧵 Description du projet

Cette application mobile permet la gestion et la réservation de costumes entre des propriétaires de boutiques (Admin) et des clients.
Le projet repose sur une architecture API REST avec un backend Laravel et un frontend mobile React Native (Expo).

L’application offre aux admins la possibilité de gérer leurs costumes et leurs réservations, tandis que les clients peuvent consulter les costumes disponibles, vérifier leur disponibilité et suivre leurs réservations.

🛠️ Technologies utilisées
Backend

Laravel

Laravel Sanctum (authentification et tokenisation API)

MySQL

phpMyAdmin

XAMPP

Frontend

React Native

Expo

🔐 Authentification & Sécurité

Inscription avec choix du rôle utilisateur :

Admin (propriétaire de boutique)

Client

Connexion via email et mot de passe

Authentification sécurisée via Laravel Sanctum (API Tokens)

Accès aux ressources protégé selon le rôle de l’utilisateur

👥 Types d’utilisateurs
🔹 Admin (Propriétaire de boutique)

L’admin peut gérer uniquement les costumes appartenant à sa boutique.

🔹 Client

Le client peut consulter les costumes disponibles et suivre ses réservations.

👔 Fonctionnalités Admin
📌 Page « Suits »

Affichage de la liste des costumes de l’admin connecté

Création d’un costume avec :

Nom

Description

Taille : XS, S, M, L, XL, 2XL, 3XL

Genre : Homme, Femme, Fille, Garçon

Couleur

Catégorie : Mariage, Traditionnel, Fête, Formel, Autre

Prix

Mise à jour des informations du costume

Marquer un costume comme Disponible / Indisponible

Consultation des détails du costume

Visualisation du calendrier des jours indisponibles

📌 Page « Réservations »

Liste des réservations liées aux costumes de l’admin

Création d’une réservation :

Sélection du client

Sélection du costume

Choix des dates via un calendrier

Les dates passées et déjà réservées sont non sélectionnables

Statut de réservation :

Payée

Non payée

Ajout d’une note (optionnelle)

Consultation des détails d’une réservation

Bouton pour appeler le client

👤 Fonctionnalités Client
📌 Page « Suits »

Affichage de tous les costumes disponibles de toutes les boutiques

Barre de recherche par nom

Filtres :

Catégorie

Taille

Genre

Ville de la boutique

Prix minimum / maximum

Consultation des détails d’un costume

Visualisation d’un calendrier indiquant les jours indisponibles

Possibilité de contacter le propriétaire de la boutique

⚠️ Le client ne peut pas réserver directement un costume.
Il consulte la disponibilité puis contacte l’admin, qui effectue la réservation.

📌 Page « Mes Réservations »

Liste des réservations créées par les admins pour le client connecté

Détails affichés :

Costume

Boutique (admin)

Dates de réservation

Statut du paiement

🗓️ Gestion des disponibilités

Calendrier interactif

Impossible de sélectionner une date antérieure à la date du jour

Les jours déjà réservés sont automatiquement bloqués

Les disponibilités sont synchronisées entre les réservations

🧩 Architecture du projet

Backend Laravel exposant une API REST

Authentification sécurisée avec Laravel Sanctum

Base de données MySQL gérée via phpMyAdmin

Environnement de développement local via XAMPP

Application mobile développée avec React Native Expo

🚀 Installation (résumé)
Backend (Laravel)
composer install
php artisan migrate
php artisan serve

Frontend (React Native)
npm install
expo start

📌 Conclusion

Cette application permet de digitaliser la gestion des costumes et des réservations entre boutiques et clients grâce à une interface mobile intuitive et un système de calendrier intelligent, sécurisé par Laravel Sanctum.
