import express from 'express'

const bcrypt = require('bcrypt')
const saltRounds = 10
const router = express.Router()
const _ = require('underscore');

import User from '../models/user'

const { verificarAuth, verificarAdmin } = require('../middelwares/auth')

router.post('/nuevo-usuario', async (req, res) => {

     const body = {
          nombre: req.body.nombre,
          email : req.body.email,
          rol   : req.body.rol,
     }

     body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

     try {
          const usuarioDB = await User.create(body)
          res.json(usuarioDB)

     } catch (error) {
          return res.status(500).json({
               mensaje: 'Error',
               error
          })
     }
})

router.put('/usuario/:id', [verificarAuth, verificarAdmin], async(req, res) => {

     let id = req.params.id;
     let body = _.pick(req.body, ['nombre', 'email', 'role', 'pass']);
     if(body.pass){
       body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
     }
   
     try {
       // {new:true} nos devuelve el usuario actualizado
       const usuarioDB = await User.findByIdAndUpdate(id, body, {new: true, runValidators: true});
   
       return res.json(usuarioDB);
   
     } catch (error) {
       return res.status(400).json({
         mensaje: 'Ocurrio un error',
         error
       })
     }
   
});

router.delete('/usuario/:id', [verificarAuth, verificarAdmin] , async(req, res) => {

     let id = req.params.id;
   
     try {
   
       const usuarioDelete = await User.findByIdAndRemove(id);
   
       if(!usuarioDelete){
         return res.status(400).json({
           mensaje: 'Usuario no encontrado'
         })
       }
   
       return res.json(usuarioDelete);
       
     } catch (error) {
       return res.status(400).json({
         mensaje: 'Ocurrio un error',
         error
       })
     }
   
   });

module.exports = router