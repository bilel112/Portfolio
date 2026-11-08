# Reconnaissance faciale et détection des émotions

Application de bureau JavaFX qui utilise une webcam pour détecter des visages, permettre une authentification faciale et analyser une émotion à la demande. Les profils et leurs données faciales sont gérés dans MariaDB/MySQL.

## Fonctionnalités

- **Gestion des utilisateurs** : création, consultation, modification et suppression des profils.
- **Détection des visages par webcam** : affichage du flux vidéo et repérage des visages avec OpenCV.
- **Authentification faciale** : comparaison d'un visage capturé avec les données faciales enregistrées.
- **Analyse d'émotion à la demande** : le bouton « Capturer et Analyser » capture le visage détecté, le transmet à DeepFace et affiche l'émotion dominante.
- **Interface de bureau** : écrans JavaFX pour la connexion, la gestion des profils, la caméra et l'analyse.
- **Base de données relationnelle** : stockage des profils et des données faciales dans MariaDB/MySQL.

> La caméra affiche un flux en direct, mais l'analyse d'émotion n'est pas continue : elle démarre lorsque l'utilisateur clique sur le bouton de capture. L'image utilisée pour cette analyse est temporaire et n'est pas enregistrée dans la base par ce parcours.

## Technologies et méthodes

Le détail des composants et leur rôle est décrit dans [TECHNOLOGIES.md](./TECHNOLOGIES.md). En bref, le code utilise OpenCV et le classificateur Haar pour la détection des visages, LBPH pour la reconnaissance faciale, et DeepFace/TensorFlow pour l'analyse des émotions.

**YOLO n'est pas actuellement intégré dans le code actif** : aucune utilisation de YOLO n'a été trouvée dans les classes Java ni dans le script Python embarqué. Un fichier ONNX est présent dans les ressources, mais sa présence seule ne signifie pas que le programme l'exécute.

## Prérequis

- Java 17 ou supérieur
- Maven
- MariaDB ou MySQL
- Python 3.11 recommandé
- Webcam accessible par l'application

## Installation sous Windows

Ouvrez PowerShell dans le dossier du projet :

```powershell
cd "C:\Users\bilel\Downloads\EmotionDetection-main"
```

### 1. Configurer la base de données

Le code utilise par défaut la base `3a21`, l'utilisateur `root` et un mot de passe vide. Créez la base et la table dans MariaDB/MySQL :

```sql
CREATE DATABASE IF NOT EXISTS `3a21`;
USE `3a21`;

CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    age INT,
    face_data LONGBLOB
);
```

Si votre configuration MariaDB/MySQL utilise d'autres identifiants, adaptez l'URL, l'utilisateur et le mot de passe dans `src/main/java/utils/MyDb.java`.

### 2. Installer les dépendances Python

Créez un environnement virtuel et installez les paquets indiqués par le projet ainsi que DeepFace et TensorFlow, requis par l'analyse d'émotion :

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install deepface tensorflow
```

Avant le lancement, activez l'environnement dans le même terminal afin que l'application Java puisse trouver ce Python :

```powershell
.\.venv\Scripts\Activate.ps1
```

Si PowerShell refuse l'activation dans la session courante :

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 3. Lancer l'application

Vérifiez que Java, Maven et la base de données sont accessibles, puis lancez :

```powershell
java -version
mvn -version
mvn clean javafx:run
```

L'application recherche un visage et propose l'analyse d'émotion depuis son écran dédié. Lors de la première analyse, DeepFace peut télécharger ses modèles pré-entraînés.

## Commandes utiles

Compiler et tester la résolution des dépendances Maven :

```powershell
mvn clean install
```

Construire le paquet du projet :

```powershell
mvn clean package
```

## Structure du projet

```text
src/
├── main/java/
│   ├── Controllers/       # Contrôleurs des écrans JavaFX
│   ├── models/            # Modèle User
│   ├── services/          # Opérations utilisateur et reconnaissance faciale
│   ├── utils/             # Accès caméra et base de données
│   └── org/example/       # Points d'entrée de l'application
└── main/resources/
    ├── *.fxml             # Interfaces JavaFX
    └── haarcascades/      # Classificateur Haar et ressources de vision
```

## Confidentialité

Les images de capture utilisées pour l'analyse d'émotion sont écrites dans un fichier temporaire local. Les données faciales des profils sont enregistrées dans la base de données. Utilisez des identifiants de base de données adaptés à votre environnement et protégez l'accès à ces données biométriques.

## Licence

MIT — voir le fichier [LICENSE](./LICENSE), s'il est présent dans cette distribution.

## Auteur

Bilel Brini
