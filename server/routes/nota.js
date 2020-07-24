import express from 'express'

const router = express.Router()

import Nota from '../models/nota'

const { verificarAuth, verificarAdmin } = require('../middelwares/auth')

router.post('/nueva-nota', verificarAuth, async (req, res) => {
     const body = req.body;

     body.usuarioId = req.usuario._id

     try {

          const notaDB = await Nota.create(body)
          res.status(200).json(notaDB)
     } catch (error) {
          return res.status(500).json({
               mensaje: 'Error en db',
               error
          })
     }
})

router.get('/nota/:id', verificarAuth, async(req,res)=>{

     const usuarioId = req.usuario._id
     const _id = req.params.id

     try {
          const notaDB = await Nota.findOne({_id, usuarioId})
          res.json(notaDB)

     } catch (error) {
          return res.status(400).json({
               mensaje: 'Error',
               error
          })
     }
})


router.get('/nota', verificarAuth, async(req,res)=>{

     const usuarioId = req.usuario._id

     try {
          const notaDB = await Nota.find({usuarioId});
          res.json(notaDB)
     } catch (error) {
          return res.status(400).json({
               mensaje: 'Error',
               error
          })
     }
})

router.delete('/nota/:id', verificarAuth, async(req,res) => {

     const usuarioId = req.usuario._id
     const _id = req.params.id

     try {
          const notaDB = await Nota.findByIdAndDelete({_id, usuarioId});
          if(!notaDB){
               return res.status(400).json({
                    mensaje: 'Error',
                    error
               })
          }else{
               res.json(notaDB)
          }
     } catch (error) {
          return res.status(400).json({
               mensaje: 'Error',
               error
          })
     }
})

router.put('/nota/:id', verificarAuth, async( req, res ) => {
     const _id = req.params.id
     const body = req.body
     const usuarioId = req.usuario._id

     try {
          const notaDB = await Nota.findByIdAndUpdate({_id, usuarioId}, body, {new:true})
          if(!notaDB){
               return res.status(400).json({
                    mensaje: 'Error',
                    error
               })
          }else{
               res.json(notaDB)
          }
     } catch (error) {
          return res.status(400).json({
               mensaje: 'Error',
               error
          })
     }

})

module.exports = router;