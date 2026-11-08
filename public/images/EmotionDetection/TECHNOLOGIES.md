# Technologies et méthodes utilisées

Ce document distingue les composants repérés dans le code du projet des technologies qui ne sont pas actuellement intégrées.

## Technologies effectivement utilisées

### Java 17 et JavaFX

Java porte l'application de bureau, ses contrôleurs et ses services. JavaFX/FXML sert à afficher les écrans de connexion, la gestion des utilisateurs, le flux caméra et le résultat de l'analyse.

### Vision par ordinateur : OpenCV

OpenCV est utilisé depuis Java via JavaCV/JavaCPP pour accéder à la webcam, lire et transformer les images et repérer les visages.

La détection faciale visible dans le code utilise le classificateur en cascade **Haar** (`haarcascade_frontalface_default.xml`). Il ne s'agit pas de YOLO.

### Reconnaissance faciale : LBPH

Le service utilisateur utilise `LBPHFaceRecognizer` d'OpenCV pour entraîner et charger un modèle de reconnaissance faciale à partir des données associées aux profils, puis comparer un visage capturé à ces données.

LBPH est une méthode de reconnaissance faciale basée sur les motifs binaires locaux ; ce n'est pas un modèle CNN ni YOLO.

### Détection d'émotions : DeepFace et TensorFlow

Lors d'une demande d'analyse, l'application capture le visage détecté, l'écrit dans un fichier temporaire, puis lance un script Python qui appelle `DeepFace.analyze` avec l'action `emotion`. Le résultat, dont l'émotion dominante, est ensuite affiché dans l'interface.

DeepFace fournit le modèle pré-entraîné d'analyse d'émotions fondé sur un réseau neuronal convolutif (CNN). Le projet l'utilise comme dépendance : il ne contient pas de code d'entraînement d'un CNN personnalisé. TensorFlow est vérifié et utilisé comme dépendance de l'environnement DeepFace.

### MariaDB/MySQL

Le connecteur JDBC est utilisé pour les opérations de gestion des profils et l'enregistrement des données faciales dans la table `user`.

## YOLO et ONNX : état dans cette version

**YOLO n'est pas utilisé par le parcours applicatif actuellement présent dans le code.** Les contrôleurs et services Java repèrent les visages avec `CascadeClassifier.detectMultiScale` et le classificateur Haar ; le script d'émotion appelle DeepFace.

Un fichier `src/main/resources/haarcascades/models/onnx_model.onnx` est fourni et `onnxruntime` figure dans `requirements.txt`, mais aucune référence active à YOLO, aucun chargement de ce fichier ONNX et aucun appel à ONNX Runtime n'ont été trouvés dans le code Java/Python examiné. Il ne faut donc pas présenter YOLO comme une fonctionnalité opérationnelle sur la seule base de ces ressources.

Si une version du projet utilise YOLO dans une autre branche, un notebook ou un script non inclus ici, il faut ajouter cette implémentation au dépôt et préciser son rôle avant de la documenter comme une méthode réellement utilisée par cette version.

## Dépendances Python

Le fichier `requirements.txt` contient OpenCV Python, NumPy et ONNX Runtime. Le contrôleur d'analyse demande également DeepFace et TensorFlow ; ces deux paquets ne sont pas listés actuellement dans `requirements.txt` et doivent être installés séparément pour utiliser l'analyse d'émotion.
