<template>
     <div class="container">
          <h1>Notas</h1>

          <b-alert
          :show="dismissCountDown"
          dismissible
          :variant="mensaje.color"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
          >
               {{mensaje.texto}}
          </b-alert>

          <form @submit.prevent="agregarNota(nota)" v-if="agregar">
               <h3 class="text-center">Agregar nueva Nota</h3>
               <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="nota.nombre">
               <input type="text" placeholder="Ingrese una descripcion" class="form-control my-2" v-model="nota.descripcion">
               <b-button class="btn-sm btn-block btn-success" type="submit">Agregar</b-button>
          </form>

          <form @submit.prevent="editarNota(notaEditar)" v-else>
               <h3 class="text-center">Editar Nota</h3>
               <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="notaEditar.nombre">
               <input type="text" placeholder="Ingrese una descripcion" 
               class="form-control my-2" v-model="notaEditar.descripcion">
               <b-button class="btn-sm btn-block mb-1 btn-warning" type="submit">Editar</b-button>
               <b-button class="btn-sm btn-block" @click="agregar = true">Cancelar</b-button>
          </form>

          <table class="table">
               <thead>
               <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Acciones</th>
               </tr>
               </thead>
               <tbody>
               <tr v-for="(item, index) in notas" :key="index">
                    <th scope="row">{{item._id}}</th>
                    <td>{{item.nombre}}</td>
                    <td>{{item.descripcion}}</td>
                    <td>{{item.date}}</td>
                    <td>
                    <b-button class="btn-warning btn-sm mx-2" @click="activarEdicion(item._id)">Actualizar</b-button>
                    <b-button class="btn-danger btn-sm mx-2" @click="eliminarNota(item._id)">Eliminar</b-button>
                    </td>
               </tr>
               </tbody>
          </table>
     </div>
</template>

<script>
export default {
     name: 'Notas',
     data() {
          return{
               notas: [],
               mensaje: {color: 'success', texto: ''},
               dismissSecs: 5,
               dismissCountDown: 0,
               nota: {},
               agregar: true,
               notaEditar: {},
          }
     },
     created() {
          this.listarNotas()
     },
     methods: {
          listarNotas(){
               this.axios.get('/nota')
                    .then(res => {
                         // console.log(res.data)
                         this.notas = res.data
                    })
                    .catch(e => {
                         console.log(e.response)
                    })
          },
          countDownChanged(dismissCountDown) {
               this.dismissCountDown = dismissCountDown
          },
          showAlert() {
               this.dismissCountDown = this.dismissSecs
          },
          agregarNota(item){
               this.axios.post('nueva-nota', item)
               .then(res => {
                    // Agrega al inicio de nuestro array notas
                    this.notas.unshift(res.data);

                    // Alerta de mensaje
                    this.showAlert();
                    this.mensaje.texto = 'Notas Agregada!'
                    this.mensaje.color = 'success';
               })
               .catch( e => {
                    console.log(e.response.data.error.errors.nombre.message);

                    // Alerta de mensaje
                    this.showAlert();
                    this.mensaje.color = 'danger';
                    this.mensaje.texto = e.response.data.error.errors.nombre.message;
               })
               this.nota = {}
          },
          eliminarNota(id){
               this.axios.delete(`nota/${id}`)
               .then(res => {
                    let index = this.notas.findIndex( item => item._id === res.data._id )
                    this.notas.splice(index, 1);

                    this.showAlert();
                    this.mensaje.texto = 'Notas Eliminada!'
                    this.mensaje.color = 'danger'
               })
               .catch( e => {
                    console.log(e.response);
               })
          },
          activarEdicion(id){
               this.agregar = false;
               this.axios.get(`nota/${id}`)
                    .then(res => {
                    this.notaEditar = res.data;
                    })
                    .catch(e => {
                    console.log(e.response);
                    })
          },
          editarNota(item){
               this.axios.put(`nota/${item._id}`, item)
                    .then(res => {
                    let index = this.notas.findIndex( itemNota => itemNota._id === this.notaEditar._id);
                    this.notas[index].nombre = this.notaEditar.nombre;
                    this.notas[index].descripcion = this.notaEditar.descripcion;
                    this.notaEditar = {}

                    this.showAlert();
                    this.mensaje.texto = 'Nota Actualizada'
                    this.mensaje.color = 'success'
                    })
                    .catch(e => {
                    console.log(e);
                    })
               this.agregar = true;
          },
     },
}
</script>