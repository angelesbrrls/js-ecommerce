/*La variable modeTest permite seleccionar la opción por el cual que queremos obtener los datos de la lista principal
    Si el valor se coloca en FALSE obtendrá los valores por medio de una ApiREST. (Default)
    Si el valor se coloca en TRUE obtendrá los valores de manera local.
    Para este proyecto se coloca de manera inicial en FALSE para obtener los datos por medio de la API REST.
*/
const modeTest = true;

let productos = [];
let productosSeleccionados = [];
let cantidadArticulos = 0;
let nombre = "Invitado especial";

//localStorage.setItem("productosSeleccionados",JSON.stringify(productosSeleccionados));
localStorage.setItem("nombreInvitado", nombre);

document.getElementById("btnEntrar").onclick = function () {
  try {
    obtenerDatos();
    cargarFormulario();
  } catch (error) {
    console.log(error);
    productos = [];
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Algo salió mal!",
      footer:"<p>No fue posible obtener respuesta del proveedor de datos. Por favor, intente más tarde.</p>",
    });
  }
};

async function obtenerDatos() {
  try {
    if (modeTest) {
      productos = productosLocales;
      localStorage.setItem("productos", JSON.stringify(productos));
    } else {
      const resp = await fetch("https://api.jsonbin.io/v3/b/65dce7ca266cfc3fde8fae49")
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem("productos", JSON.stringify(data.record));
          productos = data.record;
        }).catch((error) => console.error("Error fetching JSON:", error));
    }
    cargarProductos();
  } catch (error) {
    productos = [];
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Algo salió mal!",
      footer: "<p>No fue posible obtener respuesta del proveedor de datos</p>",
    });
  }
}

// Función para cargar la lista de productos
function cargarProductos() {
  let title_portafolio = document.getElementById("title_portafolio");
  title_portafolio.innerHTML = `
    <h2 class="section-heading text-uppercase">Muebles</h2>
    <h3 class="section-subheading text-muted">Selecciona para agregar al carrito</h3>`;
  const productosGuardados = JSON.parse(localStorage.getItem("productos"));
  let listaProductos = document.getElementById("listaProductos");
  listaProductos.innerHTML = "";
  for (let producto of productosGuardados) {
    listaProductos.innerHTML += `
      <div class="col-lg-4 col-sm-6 mb-4">
        <div class="portfolio-item">
            <div class="portfolio-caption">
                <div class="portfolio-caption-heading">${producto.nombre}</div>
            </div>
            <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal${producto.id}">
                <div class="portfolio-hover"><div class="portfolio-hover-content"><i class="fas fa-solid fa-magnifying-glass fa-3x"></i></div>
                </div><img class="img-fluid" src="${producto.image}" alt="..." />
            </a>
            <div class="portfolio-caption">
                <div class="row">
                    <div class="col-sm-6" class="portfolio-caption-subheading text-muted">$MX ${producto.precio}</div>
                    <div class="col-sm-6" class="portfolio-caption-subheading text-muted">
                        <span><i onclick="agregarProducto(${producto.id},false)" class="fa-solid fa-cart-plus fa-2xl color-default"></i></span>
                    </div>
                </div>
            </div>
        </div>
      </div>
     `;
  }
  crearModal();
}

function crearModal() {
  // Crea los modals de los productos
  const productosGuardados = JSON.parse(localStorage.getItem("productos"));
  const elementoDiv = document.createElement("div");
  elementoDiv.classList.add("bg-yellow", "text-lg");
  elementoDiv.setAttribute("id", "my-id");
  for (let producto of productosGuardados) {
    elementoDiv.innerHTML += `
            <div class="portfolio-modal modal fade" id="portfolioModal${producto.id}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-8">
                                    <div class="modal-body" id="detalle">
                                            $MX ${producto.precio}
                                        <h2 class="text-uppercase">${producto.nombre}</h2>
                                        <p class="item-intro text-muted">Artículo exclusivo</p>
                                        <img class="img-fluid d-block mx-auto" src="${producto.image}" alt="..." />
                                        <p>${producto.descripción}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
  }
  const box = document.getElementById("box");
  box.appendChild(elementoDiv);
}

// Calcular totales
function calcularTotal() {
    const compra = { iva: .16, cantidad: 0, calculoIva:0, total: 0, totalConIva: 0, detalle: '' }
    for (let producto of productosSeleccionados) {
        compra.detalle += ` <tr>
                <td> ${producto.nombre} </td>
                <td> $${producto.precio} </td>
                <td><span class="col-sm-6" class="portfolio-caption-subheading text-muted"><span><i onclick="agregarProducto(${producto.id}, true)" class="fa-solid fa-minus fa-sm color-danger"></i></span></span> <span>${producto.cantidad}</span> <span class="col-sm-6" class="portfolio-caption-subheading text-muted"><span><i onclick="agregarProducto(${producto.id},false)" class="fa-solid fa-plus fa-sm color-default" ></i></span></span> </td>
                <td> $${producto.total} </td>
                <td><i class="fa-solid fa-trash-can fa-lg color-danger" onclick="removerProducto(${producto.id})"></i></td>
            </tr> `;
            compra.total += producto.total;
            compra.cantidad += producto.cantidad;
    }
    compra.calculoIva = compra.total * compra.iva;
    compra.totalConIva = compra.total  + compra.calculoIva;
    cantidadArticulos = compra.cantidad
    mostrarCompra(compra);
}

function mostrarCompra(compra) {
    let carrito = document.getElementById("carrito");
    carrito.innerHTML = `
      <h5> Carrito de Compras</h5>
      <table class=\"table\">
          <thead><tr>
              <th scope=\"col\">Producto</th>
              <th scope=\"col\">Precio Unitario</th>
              <th scope=\"col\">Cantidad</th>
              <th scope=\"col\">Total</th>
              <th scope=\"col\"></th>
          </tr></thead>
          <tbody> ${compra.detalle} </tbody>
      </table>
      <p>Ha agregado <b> ${compra.cantidad} </b> producto(s). El valor de su compra es de $ <b>${compra.total} </b> MX + <b>${compra.calculoIva} </b>IVA. </p>
      <p>El total de pagar es: <b> $ ${compra.totalConIva} MX.   </b> </p>`;
      mostrarCarrito()
  }

function mostrarCarrito(){
    let car = document.getElementById("iconCar");
    let bgCantidad = document.getElementById("bgCarrito");
    bgCantidad.innerText = `${cantidadArticulos}`;
    if (productosSeleccionados.length == 0) {
      mostrarBotones("hidden");
      car.style.visibility = "hidden";
    } else {
      car.style.visibility = "visible";
    }
}

// Añadir un producto al carrito de compras
function agregarProducto(idSeleccionado, minus) {
  const found = productos.find((producto) => producto.id === idSeleccionado);
  clone = { ...found };
  if (productosSeleccionados.length == 0) { habilitaMensaje("hidden"); }
  const selected = productosSeleccionados.find((producto) => producto.id === idSeleccionado);
  if (selected) {
    if (minus != undefined && minus == true) {
      selected.cantidad -= 1;
      selected.total = selected.precio * selected.cantidad;
      if (selected.cantidad <= 0) {
        removerProducto(idSeleccionado);
        return;
      }
    } else {
      selected.cantidad += 1;
      selected.total = selected.precio * selected.cantidad;
    }
  } else {
    clone.cantidad = 1;
    clone.total = clone.precio;
    productosSeleccionados.push(clone);
  }
  localStorage.setItem("productosSeleccionados",JSON.stringify(productosSeleccionados));
  actualizarValores(minus)
}

// Actualizar calculos
function actualizarValores(minus){
    calcularTotal();
    mostrarBotones("visible");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: (minus = !undefined && minus == true)
        ? "Artículo eliminado del carrito"
        : "Artículo agregado al carrito de compras",
    });
}

//Eliminar productos
function removerProducto(idSeleccionado) {
  Swal.fire({
    title: "¿Esta seguro?",
    text: "Confirme su petición",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar!"
  }).then((result) => {
    if (result.isConfirmed) {
      productosSeleccionados = productosSeleccionados.filter((producto) => producto.id !== idSeleccionado);
      localStorage.setItem("productosSeleccionados",JSON.stringify(productosSeleccionados));
      calcularTotal();
      Swal.fire({
        title: "¡Eliminado!",
        text: "Artículo eliminado del carro de compras.",
        icon: "success",
      });
    }
  });
}


function mostrarBotones(accion) {
  // let bthCompra = document.getElementById("btnCompra");
  let bthLimpia = document.getElementById("btnLimpia");
  bthLimpia.style.visibility = accion;
}

var botonLimpiar = document.getElementById("btnLimpia");
botonLimpiar.addEventListener("click", function () {
  vaciarCarrito();
});

function vaciarCarrito() {
  productosSeleccionados = [];
  localStorage.setItem("productosSeleccionados",JSON.stringify(productosSeleccionados));
  calcularTotal();
}

function realizarPago() {
  habilitaMensaje("visible");
  vaciarCarrito();
}

function habilitaMensaje(accion) {
  let msgCompraRealizada = document.getElementById("seccionVenta");
  msgCompraRealizada.style.visibility = accion;
}

//Creación del formulario con datos por default
function cargarFormulario() {
  let info = document.getElementById("formulario");
  info.innerHTML = `
  <div class="row">
    <div class="col-md-6">
        <label for="inputName" class="form-label">
            <h6>Nombre*</h6>
        </label>
        <input type="text" class="form-control" id="inputName" value="${nombre}" required>
        <div class="invalid-feedback">Campo obligatorio</div>
    </div>
    <div class="col-md-6">
        <label for="inputEmail" class="form-label">
            <h6>Correo Electrónico*</h6>
        </label>
        <input type="email" class="form-control" id="inputEmail" value="invitado.especial@testfurnitures.com" required>
        <div class="invalid-feedback">Campo obligatorio</div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12 g-3">
        <label for="inputAddress" class="form-label">
            <h6>Dirección de envío*</h6>
        </label>
        <input type="text" class="form-control" id="inputAddress" placeholder="Escriba"
            value="Ciudad de México, Mexico" required>
        <div class="invalid-feedback">Campo obligatorio</div>
    </div>
  </div>

  <div class="row">
  <div class="col-sm-12 g-3"><h6>Método de Pago*</h6></div>
    <div class="col-12 g-3">
      <select id="mySelect" onchange="seleccionarMetodo()" class="form-select" aria-label="Método de pago" required>
          <option selected disabled value="">Seleccione un método de pago</option>
          <option value="1">Tarjeta de crédito</option>
          <option value="2">Tarjeta de débito</option>
      </select>
        <div class="invalid-feedback">Campo obligatorio</div>
    </div>
  </div>  
  <div class="row">
  <div class="col-sm-12 g-3"></div>
    <div id="datosPago">
      
    </div>
  </div> 
  <div class="row">
    <div class="row g-3">
    <button id = "" class="btn btn-primary" type="submit">Realizar compra</button>
    </div>
  </div>
`;
}

function seleccionarMetodo() { // Selecciona método de pago
  let selected = document.getElementById("mySelect").value;
  let titulo = selected == 1 ? 'Tarjeta de crédito' : 'Tarjeta de débito' 
  let metodo = document.getElementById("datosPago");
  metodo.innerHTML=`
  <div class="row g-3">
    <h2>${titulo}</h2>
  </div>
  <form>
    <div class="row g-3">
      <div class="col-md-12">
      <label for="dato1" class="form-label">Nombre completo</label>
      <input type="text" class="form-control" id="dato1" value="Invitado especial(Usuario para pruebas)" disabled>
      </div>
    </div>
    <div class="row g-3">
      <div class="col-md-8">
        <label for="dato2" class="form-label">Número de Tarjeta</label>
        <input type="text" class="form-control" id="dato2" value="0000-0000-0000-0000" disabled>
      </div>
      <div class="col-md-4">
        <label for="dato3" class="form-label">CVC</label>
        <input type="password" class="form-control" id="dato3" value="000" disabled>
      </div>
    </div>
  </div>
</form>
  `
}

//Evento para realizar pago
const botonPagar = document.getElementById("form");
botonPagar.addEventListener("submit", confirmarPago);

function confirmarPago (event) {
  event.preventDefault();
  if (productosSeleccionados.length > 0){
   Swal.fire({
      title: "¿Confirmar su compra?",
      text: "Si esta seguro, confirme su compra.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, realizar compra!"
    }).then((result) => {
      if (result.isConfirmed) {
        let timerInterval;
        Swal.fire({
          title: "Realizando compra!",
          html: "En proceso, por favor espere",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {

            let name = document.getElementById("inputName").value;
            let email = document.getElementById("inputEmail").value;
            let seccionVenta = document.getElementById("seccionVenta");
            seccionVenta.innerHTML = `<h3>¡Gracias por su compra! </h3>
               <p> <span class= "visita">${name}</span>...
               Se ha realizado su compra con éxito, el detalle de su compra se enviará a la dirección correo electrónico: ${email}.
               </p><h6>¡Vuelva pronto!</h6>`;
            realizarPago();
            Swal.fire({
              title: "Compra Finalizada!",
              text: "Su compra ha sido realizada.",
              icon: "success"
           });
          }
        });
      }
    });
  } else {
    Swal.fire("El carrito de compras se encuentra vacío!");
  }
}


botonLimpiar.addEventListener("click", function () {
  vaciarCarrito();
});

