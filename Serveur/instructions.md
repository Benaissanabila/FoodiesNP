Pour initialiser le projet
npm init (renommer index.js pour app.js, laisser le reste comme tel)

Pour installer les dépendances
npm i express mongoose
npm i dotenv nodemon --save-dev

Modifier package.JSON et ajoutant la ligne : "type" : "module"
et en effacant le script de test pour le remplacer par "dev" : "nodemon app.js"

Créer un ficher .env et y insérer l'adresse de la base de données (DATABASE_URL=mongodb://localhost:27017/veggiesInfo)

Créer un fichier .gitignore et y mettre deux lignes :
.env et node_modules afin que ceux-ci soient ignorés si on met le projet sur git.

Créer un fichier app.js et y metter un message de console.  Faire ensuite, dans le terminal, npm run dev et le message devrait s'afficher à l'écran de la console.

Créer un dossier router et y ajouter un fichier Veggies.js, qui contiendra les routes concernant.

