const express = require('express');
const connection = require('../connections');
const router = express.Router();
var auth = require('../services/authentication');

//Ajouter un projet à la BD + créateur du projet ajouté en tant que créateur
router.post('/add', auth.authenticateToken, (req, res, next) => {
    let project = req.body;
    let userId = res.locals.id; // on récupère l'id de la personne connecté via auth.authenticateToken
    let query = "INSERT INTO project (name, description, creator_id, nbParticipant, date, nbParticipantMax) VALUES (?, ?, ?, 1, ?, ?)";

    connection.query(query, [project.Nom, project.description, userId, project.Date, project.NbParticipantMax], (err, results) => {
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

//Modifier le nom d'un projet
router.patch('/updateName',(req,res,next)=>{
    let project = req.body;
    var query = "update project set name=? where id_project=?";
    connection.query(query,[project.name, project.id_project],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Project id does not exist"});
            }
            return res.status(200).json({message:"Project name updated successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//Modifier la description d'un projet
router.patch('/updateDescription',(req,res,next)=>{
    let project = req.body;
    var query = "update project set description=? where id_project=?";
    connection.query(query,[project.description, project.id_project],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Project id does not exist"});
            }
            return res.status(200).json({message:"Project description updated successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/addUserToProject/:id',(req,res)=>{
    const projectid = parseInt(req.params.id);
    var query = "update project set nbParticipant = nbParticipant + 1 where id_project =?";
})



module.exports = router;