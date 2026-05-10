# 🎬 Popcorn

Application web de découverte de films et séries inspirée des plateformes de streaming, permettant d’explorer des contenus via une navigation classique et une approche par “humeur”, avec une interface immersive type cinéma.

👉 Démo : [Netlify - cine-popcorn](https://cine-popcorn.netlify.app) <br>
👉 Front : [GitHub - Popcorn](https://github.com/audecharrier/popcorn) <br>
👉 API : [GitHub - API-Popcorn](https://github.com/audecharrier/api-popcorn)<br>

👉 La base de données Supabase n'est pas encore déployée sur Netlify/Render, ni intégrée à ce ReadMe.
<br>

## Contexte

Projet réalisé en équipe dans le cadre d’une formation en développement web.

Il s’agit de notre premier projet utilisant React et l’intégration d’API externes, avec pour objectif de passer d’un site statique à une application dynamique basée sur des données réelles.

<br>

## Fonctionnalités

- Recherche de films et séries via API TMDB
- Affichage d’un catalogue dynamique
- Filtres par genres et types
- Exploration par “humeur” (emojis reliés à des genres)
- Page détail film / série :
  - synopsis
  - bande-annonce
  - redirection vers plateformes de streaming
- Page “séances” :
  - films actuellement au cinéma
  - API de cinémas (développée en interne)
- Chat communautaire (fonctionnel, avec bugs connus)
- Système de favoris et watchlist
- Interface responsive inspirée des plateformes de streaming

<br>

## Stack technique

- React
- JavaScript (ES6+)
- TypeScript
- HTML5 / CSS3 (Flexbox / Grid)
- API externe : TMDB
- API REST personnalisée
- React Router (navigation dynamique avec paramètres)
- Context API (gestion des données globales)
- LocalStorage (persistance côté client)
- Supabase (utilisateurs du chat)
- Git / GitHub (travail collaboratif)

<br>

## Ma contribution

### Filtrage et logique utilisateur

- Développement d’un composant de tri et filtrage responsive
- Implémentation de la logique de filtrage par genres et types
- Gestion d’un state objet regroupant plusieurs filtres pour éviter la multiplication des états locaux
- Intégration avec les données issues de l’API TMDB via Context API

<br>

### Gestion des données (API & Context)

- Mise en place du Context API pour centraliser les données issues de l’API
- Transmission des données aux composants de filtrage sans props drilling
- Participation aux appels API de la page d’accueil

<br>

### UX / navigation

- Proposition d’une navigation unifiée pour films et séries sur une même page dynamique
- Adaptation du comportement de la page selon le point d’entrée utilisateur
- Contribution à l’écran d’accueil avec mise en avant des affiches et informations films

<br>

### Interface utilisateur

- Développement de la page profil (UI responsive)
- Adaptation d’un composant carrousel existant
- Intégration et adaptation des systèmes de watchlist et favoris
- Amélioration de la navigation globale et de la lisibilité de l’interface

<br>

## Limites du projet

- Chat fonctionnel mais instable (gestion des utilisateurs à revoir)
- Absence de backend et d’authentification
- Certaines données encore gérées côté front uniquement
- Prototype d’espace personnel (non finalisé)

<br>

## Améliorations possibles

- Intégration d’une API de cinémas en France avec recherche par ville
- Génération dynamique des genres directement depuis l’API TMDB (suppression du tableau statique)
- Mise en place d’un système d’authentification complet (connexion / déconnexion)
- Création d’une base de données utilisateurs pour la gestion des profils
- Correction du chat communautaire (gestion des utilisateurs à améliorer)

<br>

## Travail en équipe

- Projet réalisé à 6 avec méthodologie agile
- Première utilisation de React en environnement collaboratif
- Bonnes pratiques Git
- Gestion des conflits de code et apprentissage des workflows d’équipe
- Gestion des différents formats d’écrans entre les collaborateurs
- Amélioration de la cohérence UI en fin de projet

<br>

## 📂 Installation

### Backend (API)

```bash
git clone https://github.com/audecharrier/api-popcorn
cd api-popcorn
npm install
```

### Configuration du backend

Le projet peut nécessiter un fichier .env basé sur le .env.sample présent dans le repository.

### Lancement du backend

```bash
node index.js
```

### Frontend

```bash
git clone https://github.com/audecharrier/popcorn
cd popcorn
npm install
```

### Configuration du frontend

Le projet peut nécessiter un fichier .env basé sur le .env.sample présent dans le repository.

### Lancement du frontend

```bash
npm run dev
```
