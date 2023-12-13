const { createApp } = Vue;
createApp({
  data() {
    return {
      productos: [],
      //url:'http://localhost:5000/productos',
      // si el backend esta corriendo local usar localhost 5000(si no lo subieron a pythonanywhere)
      url: "https://chnoba.pythonanywhere.com/productos", // si ya lo subieron a pythonanywhere
      carrito: {},
      carritoVacio: true,
      error: false,
      cargando: true,
      /*atributos para el guardar los valores del formulario */
      id: 0,
      nombre: "",
      imagen: "",
      stock: 0,
      precio: 0,
      descripcion: ""
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.productos = data;
          this.cargando = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    eliminar(producto) {
      const url = this.url + "/" + producto;
      var options = {
        method: "DELETE",
      };
      fetch(url, options)
        .then((res) => res.text()) // or res.json()
        .then((res) => {
          location.reload();
        });
    },
    grabar() {
      let producto = {
        nombre: this.nombre,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen,
        descripcion: this.descripcion,
      };
      var options = {
        body: JSON.stringify(producto),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      fetch(this.url, options)
        .then(function () {
          alert("Registro grabado");
          window.location.href = "./productos.html";
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Grabarr");
        });
    },
    agregarAlCarrito(producto){
      try {
        if (this.carrito.hasOwnProperty(producto.id)) {
          // Si existe, verifica si la cantidad es menor al stock antes de incrementar
          if (this.carrito[producto.id] < producto.stock) {
            this.carrito[producto.id]++;
            this.showToast();
          } else {
            // Aquí puedes manejar la lógica si la cantidad alcanza el stock máximo
            console.warn("Stock máximo alcanzado para este producto.");
            this.toastError();
          }
        } else {
          // Si no existe, inicializa la cantidad en 1
          this.carrito[producto.id] = 1;
          this.showToast();
        }
        
        this.actualizarCarritoVacio();
        this.guardarCarritoEnLocalStorage();
        // Refresca la interfaz de usuario
        this.$forceUpdate();
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
      }
    },
  
    getProductImage(productId) {
      const product = this.productos.find(producto => producto.id === parseInt(productId));
      return product ? product.imagen : '';
    },
    getProductName(productId) {
      const product = this.productos.find(producto => producto.id === parseInt(productId));
      return product ? product.nombre : '';
    },
    getProductPrice(productId) {
      const product = this.productos.find(producto => producto.id === parseInt(productId));
      return product ? product.precio : '';
    },
    getProductDescription(productId) {
      const product = this.productos.find(producto => producto.id === parseInt(productId));
      return product ? product.descripcion : '';
    },
    getProductStock(productId) {
      const product = this.productos.find(producto => producto.id === parseInt(productId));
      return product ? product.stock : '';
    },
  
    restarDelCarrito(productId) {
      try {
        if (this.carrito.hasOwnProperty(productId)) {
          // Verifica si la cantidad es mayor que 1 antes de restar
          if (this.carrito[productId] > 1) {
            this.carrito[productId]--;
          } else {
            // Si la cantidad es 1 o menos, elimina el producto del carrito
            delete this.carrito[productId];
          }
          localStorage.setItem('totalProductos',localStorage.getItem('totalProductos')-1);
          this.actualizarCarritoVacio();
          this.guardarCarritoEnLocalStorage();
          // Refresca la interfaz de usuario
          this.$forceUpdate();
        }
      } catch (error) {
        console.error("Error al restar del carrito:", error);
      }
    },

    eliminarDelCarrito(productId) {
      try {
        if (this.carrito.hasOwnProperty(productId)) {
          localStorage.setItem('totalProductos',localStorage.getItem('totalProductos')- this.carrito[productId]);
          delete this.carrito[productId];
          this.actualizarCarritoVacio();
          this.guardarCarritoEnLocalStorage();
          // Refresca la interfaz de usuario
          this.$forceUpdate();
        }
      } catch (error) {
        console.error("Error al eliminar del carrito:", error);
      }
    },
  
    getTotal() {
      try {
        let total = 0;
        let productosTotales =0;

        if (Object.keys(this.carrito).length === 0) {
          // Si el carrito está vacío, establece productosTotales en 0 y devuelve 0
          productosTotales = 0;
          localStorage.setItem('totalProductos', productosTotales);
          return 0;
        }

        for (const [productId, cantidad] of Object.entries(this.carrito)) {
          const product = this.productos.find(producto => producto.id === parseInt(productId));
          if (product) {
            total += product.precio * cantidad;
            productosTotales += cantidad;
          }
        }
        localStorage.setItem('totalProductos',productosTotales);
        return total; // Ajusta la cantidad de decimales según tu preferencia
      } catch (error) {
        console.error("Error al calcular el total del carrito:", error);
        return 0;
      }
    },
    guardarCarritoEnLocalStorage() {
      try {
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
      } catch (error) {
        console.error("Error al guardar el carrito en localStorage:", error);
      }
    },

    recuperarCarritoDesdeLocalStorage() {
      try {
        const carritoGuardado = localStorage.getItem("carrito");
  
        if (carritoGuardado) {
          this.carrito = JSON.parse(carritoGuardado);
        }
      } catch (error) {
        console.error("Error al recuperar el carrito desde localStorage:", error);
      }
    },
    actualizarCarritoVacio() {
      this.carritoVacio = Object.keys(this.carrito).length === 0;
      localStorage.setItem('carritoVacio', this.carritoVacio);
    },
    sumarAlCarrito(productId) {
      try {
        if (this.carrito.hasOwnProperty(productId)) {
          // Verifica si la cantidad es mayor que 1 antes de restar
          this.carrito[productId]++;
          this.actualizarCarritoVacio();
          this.guardarCarritoEnLocalStorage();
          // Refresca la interfaz de usuario
          this.$forceUpdate();
        }
      } catch (error) {
        console.error("Error al restar del carrito:", error);
      }
    },


    showToast() {
      this.$nextTick(() => {
        const toastLiveExample = document.getElementById('liveToast');

      if (toastLiveExample) {
        // Crea una instancia de Toast de Bootstrap
        const toast = new bootstrap.Toast(toastLiveExample, {
          animation: true,
          autohide: true,
          delay: 1000,
        });
        
        toastLiveExample.querySelector('.toast-body').innerHTML = `<div class="tostada"><img id="cart-check" src="img/cart-check.svg" alt="carrito de compra"><p id="agregado-correctamente">Agregado al carrito correctamente.</p></div>`;
       
        const toastHeaderElement = toastLiveExample.querySelector('.toast-header');
        if (toastHeaderElement) {
          toastHeaderElement.style.backgroundColor = '#009E60'; // Reemplaza con el color que desees
        }
        // Muestra el Toast
        toast.show();
      }
    })
    },
    
    toastError() {
      this.$nextTick(() => {
        const toastLiveExample = document.getElementById('liveToast');
    
        if (toastLiveExample) {
          // Crea una instancia de Toast de Bootstrap
          const toast = new bootstrap.Toast(toastLiveExample, {
            animation: true,
            autohide: true,
            delay: 1000,
          });
          const toastHeaderElement = toastLiveExample.querySelector('.toast-header');
          if (toastHeaderElement) {
            toastHeaderElement.style.backgroundColor = '#ff3232'; // Reemplaza con el color que desees
          } 
          // Cambia el mensaje del Toast según la condición
          toastLiveExample.querySelector('.toast-body').innerHTML =  `<div class="tostada"><img style="height:18px;" src="img/emblem-error.svg" alt="carrito de compra"><p id="agregado-correctamente">No hay más stock del producto.</p></div>`;
    
          // Muestra el Toast
          toast.show();
        }
      });
    }
  },

  created() {
    this.fetchData(this.url);
    this.recuperarCarritoDesdeLocalStorage();
    this.carritoVacio = JSON.parse(localStorage.getItem('carritoVacio')) ?? true;
    
  },
}).mount("#app");

