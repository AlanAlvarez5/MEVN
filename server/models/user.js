import mongoose from 'mongoose'
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const roles = {
     values: ['ADMIN', 'USER'],
     message: '{VALUE} Rol no valido'
}

const userSchema = new Schema({
     nombre: {type: String, required: [true, 'Nombre obligatorio']},
     email: {
          type: String, 
          required: [true, 'Email obligatorio'],
          unique: true
     },
     pass: {type: String, required: [true, 'Contraseña obligatorio']},
     date: {type: Date, default: Date.now},
     role: {type: String, default: 'USER', enum: roles},
     activo: {type: Boolean, default: true}
})

userSchema.plugin(uniqueValidator, {message: 'Error {PATH} debe ser único'})

userSchema.methods.toJSON = function () {
     var obj = this.toObject()
     delete obj.pass
     return obj
}

const User = mongoose.model('User', userSchema)

export default User