const mysql = require('mysql');
// Importation du module dotenv pour charger les variables d'environnement depuis un fichier .env
require('dotenv').config();

// Création de la connexion à la base de données via les infos du .env
var connection = mysql.createConnection({
  port: process.env.DB_PORT, // Port de la base de données
  host: process.env.DB_HOST, // Hôte de la base de données
  user: process.env.DB_USERNAME, // Nom d'utilisateur de la base de données
  password: process.env.DB_PASSWORD, // Mot de passe de la base de données
  database: process.env.DB_NAME // Nom de la base de données
});

// Établissement de la connexion à la base de données
connection.connect((err) => {
    if (!err) {
        console.log("Connected"); 
    } else {
        console.log(err);
    }
});

// Exporte la connexion à la base de données pour pouvoir l'utiliser dans d'autres fichiers
module.exports = connection;
