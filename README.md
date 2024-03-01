# Furnitures store e-commerce

En este proyecto simula una tienda de muebles en línea, permite seleccionar artículos, agregarlos al carrito de compras, calcular el total y realizar el pago de la compra.


# Funciones

 - **Consulta API REST**:  consulta los artículos por medio una URL (API REST)
- **Open modal**:  se muestra el detalle de cada artículo como lo son: precio, imagen, 		descripción.
- **Agregar**: Añadir un artículo al carrito de compras.
- **Eliminar**:  Quitar un artículo al carrito de compras.
- **Calcular total**: el total de la compra.
- **Realizar el pago**: de la compra.


## Carpetas y archivos

La estructura del proyecto se encuentra distribuido de la siguiente manera:
- e-commerce
	- index.html
	- js
		- main.js
		- script.js
	- css
		- styles.css
		- e-styles.css
	- assets
		- img
		- data

## Frameworks y librerías

- bootstrap 5
- sweetalert


## Instalación

Descarga o clona el proyecto e-commerce y abre el archivo index.html en su navegador (preferentemente chrome).

####  ¡IMPORTANTE!

> *Este proyecto por default consume datos por medio de un Api Rest. Sin embargo, es importante mencionar, que es posible probar con datos locales. Para probar con datos locales, es necesario colocar la variable modeTest=True, por default se encuentra en False.*


## Guía de pasos

#### Inicio
Una vez que se muestra la pantalla de inicio presione el botón entrar

#### Agrega un artículo

Para agregar un artículo al carrito de compras presione el botón agregar ( icono carrito de compras), que se encuentra debajo de la imagen.

#### Agrega o elimina un artículo desde el carro de compras

 - Agregar. Dar click al botón más (+) para sumar artículos del
                carrito.
  - Eliminar. Dar click al botón menos (-) para restar artículos del
              carrito.

#### Calculo de pago

Los cálculos se realizan de manera automática con el precio de cada artículo y la cantidad seleccionada.

#### Ingresar los datos solicitados en el formulario

Se muestra un formulario para llenar los datos del usuario que realiza la compra. (Se precargan datos por default, simulando información ya obtenida)

#### Proceder a pagar

Una vez que el usuario presiona el botón comprar, confirma la transacción e inicia el proceso de pago.

#### Pago realizado

Una vez que se realiza el pago se puede realizar una nueva compra.



