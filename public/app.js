$(function(){
  let archivo =  []
  let min, max
  let ciudades = new Set()
  let tipo =  new Set()

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$",
  onStart: (data)=>{
     min = data.from
     max = data.to 
  },
  onFinish: (data)=>{
     min = data.from
     max = data.to 
     console.log(`${min} ${max} ${$('#ciudad').val()} ${$('#tipo').val()}`)
     filtro.filtrar(min,max,$('#ciudad').val(), $('#tipo').val())

  }
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

//biblioteca de funciones
let filtro = {
  init: ()=>{
      fetch('/json')
        .then(resp =>  resp.json() )
        .then(data => archivo = data)
      setSearch()
      filtro.selectUnicos(archivo)
      
  },

  mostrarCasas: (arch) =>{
    $('.lista').empty()
   arch.forEach((item) =>{
      let element =  `<div class="card horizontal">
        <div class="card-image">
          <img src="img/home.jpg">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <div>
              <b>Direccion: ${item.Direccion} </b><p></p>
            </div>
            <div>
              <b>Ciudad: ${item.Ciudad} </b><p></p>
            </div>
            <div>
              <b>Telefono: ${item.Telefono}</b><p></p>
            </div>
            <div>
              <b>Código postal: ${item.Codigo_Postal} </b><p></p>
            </div>
            <div>
              <b>Precio: ${item.Precio}</b><p></p>
            </div>
            <div>
              <b>Tipo: ${item.Tipo} </b><p></p>
            </div>
          </div>
          <div class="card-action right-align">
            <a href="#">Ver más</a>
          </div>
        </div>
      </div>`
      $('.lista').append(element)
    })
  },

  selectUnicos: (archivo) =>{
    //borrar listas
    ciudades.clear()
    tipo.clear()
    //eliminar option de select
    $('#ciudad option, #tipo option').remove()
    $('#ciudad').append('<option value ="">Escoge una ciudad</option')
    $('#tipo').append('<option value="">Escoge un tipo</option')

    //proceso para filtrar sin repetir
    for (var i = 0; i < archivo.length; i++) {
      ciudades.add(archivo[i].Ciudad)
      tipo.add(archivo[i].Tipo)
    }

    //cargar los option a los select segun la informacion
    ciudades.forEach( item =>
      $('#ciudad').append(`<option value = "${item}" > ${item}</option>`)
    )
    tipo.forEach( item => {
      $('#tipo').append(`<option value = "${item}" > ${item}</option>`)
    })
    $('select').material_select();
  },

  busquedaCiudad: (ciudad) =>{
    let resultante =[]
    if (ciudad != "")
    archivo.forEach((item)=>{
       if (item.Ciudad == ciudad)
        resultante.push(item)
    })
    else
      resultante = archivo
    return resultante
  },

  busquedaTipo: (tipo, arch) =>{
    let resultante =[]
    if (tipo != "")
    arch.forEach((item)=>{
       if (item.Tipo == tipo)
        resultante.push(item)
    })
    else
      resultante = arch
    return resultante
  },

  filtroPrecio: (min,max, arch)=>{
    let resultante =[]
    arch.forEach((item)=>{
      var precio = Number(item.Precio.replace(/[^0-9.-]+/g,""))
      if(precio >= min && precio <= max)
         resultante.push(item)  
    })
    return resultante
  },
  filtrar: (min, max, ciudad, tipo)=>{
    let resultante = filtro.busquedaCiudad(ciudad)
    resultante = filtro.busquedaTipo(tipo, resultante)
    resultante = filtro.filtroPrecio(min, max, resultante)
    filtro.mostrarCasas(resultante)
  }

}

filtro.init()

//EVENTOS
$('#buscar').click(e =>{
  e.preventDefault()
  //hacer la consulta al servidor de la base de datos
  fetch('/json')
    .then(resp =>  resp.json() )
    .then(data => archivo = data)
    //carga todos los articulos al DOM
    filtro.mostrarCasas(archivo)
    filtro.selectUnicos(archivo)
})

$('select').on('change', () =>{
   filtro.filtrar(min,max,$('#ciudad').val(), $('#tipo').val())
})

})

