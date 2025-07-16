# Titre DWWM - Présentation du projet : CinéDélices

CinéDélices est une application web dédiée aux recettes de cuisine inspirées de films et de séries. 
Ce projet a été réalisé dans le cadre de la préparation au Titre Professionnel Développeur Web et Web Mobile.


#### Les objectifs :
- Centraliser ces recettes inspirées du cinéma et des séries.
- Permettre aux utilisateurs de contribuer et partager  leurs propres recettes.
- Offrir une immersion culinaire dans leurs univers préférés.

Notre cible : cinéphiles, passionnés de cuisine, familles, créateurs de contenus, enseignants et organisateurs de soirées à thème.

## Les fonctionnalités du projet : 

#### Pour un visiteur :

- Consulter la liste des recettes.
- Rechercher une recette par nom du film/recette.
- s'inscrire pour ajouter des recttes.

#### Pour un utilisateurs inscrits : 

- Créer un compte utilisateur.
- Se connecter et modifier son profil.
- Ajouter une nouvelle recette associée à un film et un nouveau film s’il n’existe pas encore.

#### Pour les administrateurs : 

- Gérer les recettes, films et utilisateurs
- Avoir accès à un tableau de bord pour gérer et modérer les recettes et les utilisateurs.
  
## Techno utilisées :

#### Front-End :
- HTML / CSS / JavaScript
-EJS (templating)

#### Back-End :
- Node.js + Express
- PostgreSQL avec Sequelize 
- API externe : themoviedb.org 
- Service externe : mailtrap.io

## Mise en place du projet :

Après avoir lancé votre serveur linux, il faudra se placer dans le dossier : 

  ```
 mkdir /nouveau_dossier
  ```

1. Clonez le repository de ce projet : 
  ```
  git clone git@github.com:O-clock-Athenes/Cine-Delices-back.git
  ```
2. Installez les dépences de l'application
  ```
  npm install
  ```
3. Duplier le fichier .env.templates dans .env : 
```
cp .env.template .env
```
Nous allons maintenant récupérer une clé API sur themoviedb.org et ajouter dans notre fichier .env :

- Rendez-vous sur https://www.themoviedb.org/signup . Vous y trouverez le formulaire d'inscription.
- Remplir le formulaire, accepter les conditions, vérifier votre e-mail.
- Connectez-vous à votre compte.
- Cliquez sur votre avatar → Paramètres → API.
- Choisissez "Demander une clé d'API", remplissez « Developer Plan », acceptez les conditions, et soumettez le formulaire.
- Vous obtiendrez une clé API à ajouter dans le fichier .env 

#### Installation les versions des techno :

- Nodejs : v22.14.0
- PostGreSQL : 17.4
- Git : 2.43.0
- Sequelize : 6.37.7

#### Commande pour la création de BBD sur PostSQL :
-  Ouvrez votre terminal, puis connectez-vous :

```
psql -U postgres
```

- Une fois connecté dans le postgres=#, tapez :

```
psql -U user -d cinedelices -f /src/db/createTables.js
 ```

- Lancez votre serveur : 
```
npm run dev
```

Ouvrez ensuite http://localhost:3000 pour voir le résultat dans votre navigateur.