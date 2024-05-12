const express = require('express');
const connection = require('../connections');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup',(req,res) =>{
    let user = req.body;
    query = "select name, firstname, password from user where pseudo=?"
    connection.query(query,[user.pseudo],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query = "insert into user(name, firstname, pseudo, password, status, role) values(?,?,?,?,'true', 'user')";
                connection.query(query,[user.name,user.firstname,user.pseudo,user.password],(err,results) =>{
                    if(!err){
                        return res.status(200).json({message:"Successfully Registered"});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({message: "Pseudo Already Exist."});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
    
})


//API pour se connecter
router.post('/login',(req,res)=>{
   const user = req.body;
   query = "select id_user,name,pseudo,password,status,role from user where pseudo=?"
   connection.query(query,[user.pseudo],(err,results)=>{
        if(!err){
            if(results.length <= 0 || results[0].password !=user.password){
                return res.status(401).json({message:"Incorect pseudo or Password"});
            }
            else if(results[0].status === 'false'){
                return res.status(401).json({message:"Wait for Admin Approval"});
            }
            else if(results[0].password == user.password){
                const response = { id: results[0].id_user, pseudo: results[0].pseudo, password: results[0].password, role: results[0].role};
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'});
                return res.status(200).json({token: accessToken}); 
            }
            else{
                return res.status(400).json({message:"Something went wrong. Please try again later"});
            }
        }
        else{
            return res.status(500).json(err);
        }
   })
})

//récupérer les informations d'un user
router.get('/get/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    var query = "SELECT id_user, name, firstname, pseudo, password FROM user WHERE id_user = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});






module.exports = router;