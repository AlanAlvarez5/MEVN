import express from 'express'
const router = express.Router()
const jwt = require('jsonwebtoken')


import User from '../models/user'

const bcrypt = require('bcrypt')
const saltRounds = 10

router.post('/', async (req, res) => {

     const body = req.body

     try {

          const usuarioDB = await User.findOne({email: body.email})

          if (!usuarioDB){
               return res.status(400).json({
                    mensaje: 'Email no existente',
               })
          }
          
          if (!bcrypt.compareSync(body.pass, usuarioDB.pass)){
               return res.status(400).json({
                    mensaje: 'Email no existente',
               })
          }

          const token = jwt.sign({
               data: usuarioDB
          }, 'clave secretona', {expiresIn: 60 * 60 * 24 * 30} )

          res.json({
               usuarioDB,
               token
          })
          
     } catch (error) {
          return res.status(400).json({
               mensaje: 'Ocurrio un error',
               error
          })
     }
})

module.exports = router