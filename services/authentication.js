// Importation des modules nécessaires
require('dotenv').config(); // Permet de charger les variables d'environnement depuis un fichier .env
const jwt = require('jsonwebtoken'); // Module pour gérer les JSON Web Tokens (JWT)

// Middleware pour vérifier le token d'authentification
function authenticateToken(req, res, next){
    // Récupération du header Authorization de la requête
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null)
        return res.sendStatus(401); // Retourne une réponse 401 Unauthorized si le token est manquant
    // Vérification et décodage du token
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if(err)
            return res.sendStatus(403); // Retourne une réponse 403 Forbidden si le token est invalide ou expiré
        // Si le token est valide, stocke les informations utilisateur dans res.locals pour une utilisation ultérieure
        res.locals = response;
        next();
    });
}

// Exporte la fonction authenticateToken pour pouvoir l'utiliser dans d'autres fichiers
module.exports = { authenticateToken: authenticateToken };
