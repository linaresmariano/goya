
app.service('subjectService', function($http) {

  this.areas = [
    {id:0, name:'Programación'},
    {id:1, name:'Sistemas Informáticos'},
    {id:2, name:'Matemática Básica'},
    {id:3, name:'Matemática Superior'},
    {id:4, name:'Idioma'}
  ]

  this.cores = [
    {id:0, name:'Básico Obligatorio'},
    {id:1, name:'Avanzado Obligatorio'},
    {id:2, name:'Complementaria'},
    {id:3, name:'Obligatoria'}
  ]

  this.modalities = [
    {id:0, name:'Presencial'},
    {id:1, name:'Presencial con campus virtual'},
    {id:2, name:'Virtual'}
  ]

  this.colors = [
    {name: 'Verde', id: 'green', font: 'black'},
    {name: 'Amarillo', id: 'yellow', font: 'black'},
    {name: 'Naranja', id: 'orange', font: 'black'},
    {name: 'Marrón', id: 'brown', font: 'white'},
    {name: 'Rojo', id: 'red', font: 'white'},
    {name: 'Azul', id: 'blue', font: 'white'},
    {name: 'Rosa', id: 'pink', font: 'black'}
  ]

})
