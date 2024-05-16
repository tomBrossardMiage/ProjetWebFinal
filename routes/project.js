const express = require('express');
const connection = require('../connections');
const router = express.Router();
var auth = require('../services/authentication');

//Ajouter un projet à la BD + créateur du projet ajouté en tant que créateur
router.post('/add', auth.authenticateToken, (req, res, next) => {
    let project = req.body;
    let userId = res.locals.id; // on récupère l'id de la personne connecté via auth.authenticateToken
    let query = "INSERT INTO project (name, description, creator_id, nbParticipant, date) VALUES (?, ?, ?, ?, ?)";

    connection.query(query, [project.Nom, project.description, userId, project.nbParticipant, project.Date], (err, results) => {
        if (!err) {
            let projectId = results.insertId;
            
            let insertQuery = "INSERT INTO participate (id_user, id_project) VALUES (?, ?)";
            connection.query(insertQuery, [userId, projectId], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err, message: "Tuple insertion on participate table failed" });
                } else {
                    return res.status(200).json({ message: "Project Added Successfully" });
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

//Retourner la liste des projets
router.get('/get',(req,res,next)=>{
    var query = "SELECT P.id_project,name,description,creator_id,date,nbParticipant,count(id_participate) as registeredMember from project P, participate PA where PA.id_project = P.id_project GROUP BY P.id_project,name,description,creator_id,date,nbParticipant;";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json({results});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//Retourne la liste des projet que j'ai créer
router.get('/getMy/:id',(req,res,next)=>{
    const userId = parseInt(req.params.id);
    var query = "SELECT P.id_project,name,description,creator_id,date,nbParticipant,count(id_participate) as registeredMember from project P, participate PA where P.creator_id = ? and PA.id_project = P.id_project GROUP BY P.id_project,name,description,creator_id,date,nbParticipant;";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            return res.status(200).json({results});
        } else {
            return res.status(500).json(err);
        }
    });
});

//Retourne la liste des projet ou je ne participe
router.get('/getP/:id',(req,res,next)=>{
    const userId = parseInt(req.params.id);
    var query = "SELECT P.id_project,name,description,creator_id,date,nbParticipant,count(id_participate) as registeredMember from project P, participate PA where PA.id_project = P.id_project and PA.id_user = ? and P.creator_id != ? GROUP BY P.id_project,name,description,creator_id,date,nbParticipant;";
    connection.query(query, [userId, userId], (err, results) => {
        if (!err) {
            return res.status(200).json({results});
        } else {
            return res.status(500).json(err);
        }
    });
});



//Retourne le nombre de projet que l'user connecter à créer
router.get('/getNbC/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    var query = "SELECT Count(*) as nbProject From Project WHERE creator_id = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

//Retourne le nombre de projet ou participe l'user connecté
router.get('/getNbP/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    var query = "SELECT Count(*) as nbProject From Participate WHERE id_user = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

//retourne true si l'user connecté participe au projet en question sinon false
router.get('/ParticipeOuPas/:id_user/:id_project', (req, res) => {
    const id_user = req.params.id_user;
    const id_project = req.params.id_project;

    // Requête SQL pour vérifier si l'utilisateur participe au projet
    const query = 'SELECT * FROM participate WHERE id_user = ? AND id_project = ?';

    // Exécutez la requête SQL avec les paramètres
    connection.query(query, [id_user, id_project], (error, results) => {
        if (error) {
            console.error("Erreur lors de la vérification de la participation :", error);
            return res.status(500).json({ error: "Erreur lors de la vérification de la participation" });
        }

        // Vérifiez si des résultats ont été retournés
        if (results.length > 0) {
            // L'utilisateur participe au projet
            return res.status(200).json({ participe: true });
        } else {
            // L'utilisateur ne participe pas au projet
            return res.status(200).json({ participe: false });
        }
    });
});

//s'inscrire a un projet
router.post('/follow/:id_user/:id_project',(req, res) => {
    const id_user = req.params.id_user;
    const id_project = req.params.id_project;

    const participationQuery = 'SELECT * FROM participate WHERE id_user = ? AND id_project = ?';

    const insertParticipationQuery = 'INSERT INTO participate (id_user, id_project) VALUES (?, ?)';

    connection.query(participationQuery, [id_user, id_project], (err, participationResult) => {
        if (err) {
            console.error('Erreur lors de la vérification de la participation de l\'utilisateur : ', err);
            res.status(500).json({ error: 'Erreur lors de la vérification de la participation de l\'utilisateur' });
        } else {
            if (participationResult.length > 0) {
                // L'utilisateur participe déjà au projet
                res.status(403).json({ message: "Vous participez déjà à ce projet." });
            } else {
                // L'utilisateur ne participe pas encore au projet, l'inscrire
                connection.query(insertParticipationQuery, [id_user, id_project], (err, insertResult) => {
                    if (err) {
                        console.error('Erreur lors de l\'inscription de l\'utilisateur au projet : ', err);
                        res.status(500).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur au projet' });
                    } else {
                        res.status(200).json({ message: "Inscription au projet réussie." });
                    }
                });
            }
        }
    });
});

//se désinscrire d'un projet
router.delete('/unfollow/:id_user/:id_project',(req, res) => {
    const id_user = req.params.id_user;
    const id_project = req.params.id_project;

    const creatorQuery = 'SELECT * FROM project WHERE creator_id = ? AND id_project = ?';
    
    const deleteParticipationQuery = 'DELETE FROM participate WHERE id_user = ? AND id_project = ?';

    connection.query(creatorQuery, [id_user, id_project], (err, creatorResult) => {
        if (err) {
            console.error('Erreur lors de la vérification du créateur du projet : ', err);
            res.status(500).json({ error: 'Erreur lors de la vérification du créateur du projet' });
        } else {
            if (creatorResult.length > 0) {
                // L'utilisateur est le créateur du projet
                res.status(403).json({ message: "Vous êtes le créateur de ce projet. Vous ne pouvez pas vous désinscrire." });
            } else {
                // L'utilisateur n'est pas le créateur du projet
                connection.query(deleteParticipationQuery, [id_user, id_project], (err, deleteResult) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de la participation de l\'utilisateur : ', err);
                        res.status(500).json({ error: 'Erreur lors de la suppression de la participation de l\'utilisateur' });
                    } else {
                        res.status(200).json({ message: "Votre désinscription du projet a réussi." });
                    }
                });
            }
        }
    });
});

//Supprimer le projet
router.delete('/delete/:id_user/:id_project',(req, res) => {
    const id_user = req.params.id_user;
    const id_project = req.params.id_project;

    const creatorCheckQuery = 'SELECT * FROM project WHERE creator_id = ? AND id_project = ?';
    const deleteParticipationQuery = 'DELETE FROM participate WHERE id_project = ?';
    const deleteProjectQuery = 'DELETE FROM project WHERE id_project = ?';

    connection.query(creatorCheckQuery, [id_user, id_project], (err, creatorCheckResult) => {
        if (err) {
            console.error('Erreur lors de la vérification du créateur du projet : ', err);
            res.status(500).json({ error: 'Erreur lors de la vérification du créateur du projet' });
        } else {
            if (creatorCheckResult.length === 0) {
                // L'utilisateur n'est pas le créateur du projet
                res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce projet." });
            } else {
                // L'utilisateur est le créateur du projet, supprimer le projet et les participations
                connection.query(deleteParticipationQuery, [id_project], (err, deleteParticipationResult) => {
                    if (err) {
                        console.error('Erreur lors de la suppression des participations : ', err);
                        res.status(500).json({ error: 'Erreur lors de la suppression des participations' });
                    } else {
                        // Supprimer le projet
                        connection.query(deleteProjectQuery, [id_project], (err, deleteProjectResult) => {
                            if (err) {
                                console.error('Erreur lors de la suppression du projet : ', err);
                                res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
                            } else {
                                res.status(200).json({ message: "Le projet a été supprimé avec succès." });
                            }
                        });
                    }
                });
            }
        }
    });
});

//Retourner les informations d'un projet
router.get('/get/:id',(req,res,next)=>{
    const projectId = parseInt(req.params.id);
    var query = "SELECT * from project where id_project = ?";
    connection.query(query,[projectId],(err,results)=>{
        if(!err){
            return res.status(200).json({results});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//modifier un project
router.post('/update', auth.authenticateToken, (req, res, next) => {
    let project = req.body;
    let query = "update project set name=?, description=?, nbParticipant=? , date=? where id_project=?";

    connection.query(query, [project.Nom, project.description,project.nbParticipant, project.Date,project.id_project], (err, results) => {
    if (err) {
        return res.status(500).json(err);
    }else{
        return res.status(200).json({ message: "Project updated Successfully" });
    }
});
});






module.exports = router;