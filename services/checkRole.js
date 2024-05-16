// Importation du module dotenv pour charger les variables d'environnement depuis un fichier .env
require('dotenv').config();

function checkRole(req, res, next) {
    // Vérifie si le rôle de l'utilisateur dans res.locals correspond au rôle défini dans les variables d'environnement
    if (res.locals.role == process.env.USER)
        res.sendStatus(401); // Retourne une réponse 401 Unauthorized si le rôle est celui d'un utilisateur normal
    else
        next();
}

// Exporte la fonction checkRole pour pouvoir l'utiliser dans d'autres fichiers
module.exports = { checkRole: checkRole };
