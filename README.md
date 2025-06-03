# Jeu de Construction de Mots (Word Building Game)

Un jeu éducatif interactif conçu pour aider les enfants à apprendre à lire en français en construisant des mots à partir de syllabes.

![Jeu de Construction de Mots](https://github.com/yourusername/word_game/raw/main/public/screenshot.png)

## 🎮 À propos du jeu

Ce jeu a été développé pour aider les enfants à apprendre à lire en français en leur permettant de construire des mots à partir de syllabes. Le jeu présente un mot cible et propose plusieurs syllabes parmi lesquelles l'enfant doit choisir pour former le mot correctement.

## ✨ Fonctionnalités

- **Trois niveaux de difficulté** : Facile, Moyen et Difficile, avec des mots adaptés à chaque niveau
- **Lecture vocale des mots** : Possibilité d'écouter la prononciation du mot à construire
- **Système d'indices** : Aide visuelle pour identifier les syllabes correctes
- **Retour visuel** : Animations et effets visuels pour indiquer les réponses correctes et incorrectes
- **Système de score** : Points attribués en fonction de la difficulté et de l'utilisation d'indices
- **Design responsive** : Fonctionne sur tous les appareils (ordinateurs, tablettes, smartphones)

## 🎯 Comment jouer

1. Choisissez un niveau de difficulté (Facile, Moyen ou Difficile)
2. Observez le mot affiché en haut de l'écran
3. Utilisez le bouton "Lire le mot" pour entendre la prononciation (facultatif)
4. Sélectionnez les syllabes dans le bon ordre pour former le mot
5. Si vous avez besoin d'aide, cliquez sur "Indice" pour mettre en évidence une syllabe correcte
6. Une fois le mot correctement formé, vous gagnerez des points et passerez au mot suivant
7. Vous pouvez également cliquer sur "Nouveau Mot" à tout moment pour passer à un autre mot

## 🔧 Technologies utilisées

- React
- TypeScript
- CSS
- Web Speech API (pour la synthèse vocale)

## 🚀 Installation et démarrage

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/yourusername/word_game.git
   cd word_game
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn
   ```

3. Démarrez l'application en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Ouvrez votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173)

### Construction pour la production

```bash
npm run build
# ou
yarn build
```

## 📝 Personnalisation

Vous pouvez personnaliser le jeu en modifiant les listes de mots dans le fichier `src/App.tsx`. Les mots sont organisés par niveau de difficulté :

```typescript
const WORD_CATEGORIES = {
  easy: [
    'chat', 'chien', 'bleu', 'jour', 'main', 
    'nez', 'bon', 'vert', 'lire', 'pain'
  ],
  medium: [
    'pomme', 'maison', 'école', 'jardin', 'lapin',
    'livre', 'soleil', 'fleur', 'table', 'enfant'
  ],
  hard: [
    'éléphant', 'girafe', 'papillon', 'ordinateur', 'parapluie',
    'chocolat', 'dinosaure', 'téléphone', 'crocodile', 'anniversaire'
  ]
};
```

## 📱 Compatibilité

Le jeu est compatible avec tous les navigateurs modernes et s'adapte à différentes tailles d'écran :
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.