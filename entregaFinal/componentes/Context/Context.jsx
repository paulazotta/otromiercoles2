import React, { createContext, useContext, useState, useEffect } from 'react'
import {initializeApp} from "firebase/app";
import {addDoc, collection, getDocs, getFirestore} from "firebase/firestore";
import Swal from 'sweetalert2';

const firebaseConfig = {
  apiKey: "AIzaSyAokj71nAJEKcqiSGIdUHnh9G54v-70OGc",
  authDomain: "react-flex-entrega-final-zotta.firebaseapp.com",
  projectId: "react-flex-entrega-final-zotta",
  storageBucket: "react-flex-entrega-final-zotta.appspot.com",
  messagingSenderId: "658985149827",
  appId: "1:658985149827:web:82b80b59e59a3cadfb82b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore (app)

const productsCollection = collection (db, "productos");
const ordersCollection = collection (db, "ordenes");



// 1. Creo las funciones para usar el contexto / Este es el que tenemos que consumir
// Creo el contexto 
const AppContext = createContext(); 

// para que la función sepa qué contexto usar

export const useAppContext = () => useContext(AppContext);

// 2. Armo el provider. Este es que nos provee de acceso al contexto

export const ContextProvider = (props) => {
  
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState ([]);
    const [isLoading, setIsLoading] = useState(true);


    function cargarData ()  {
      return getDocs(productsCollection).then(snapshot => {
        let arrayProductos = snapshot.docs.map(el => el.data());
        setProductos(arrayProductos);
        setIsLoading(false); 
      }).catch(err => console.error(err));
    };

    const agregarAlCarrito = (id, cantidad, nombre, valor) => {
      if (!isInCart (id, nombre, valor)){
          setCarrito(prev => [...prev, {id, cantidad, nombre, valor}])

        // Sweet alert 
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto agregado correctamente",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
          console.error("el producto ya fue agregado")
          Swal.fire({
            icon: "info",
            title: "Ya está agregado",
            text: "Este producto ya está en tu carrito de compras",
            
          });
      }  
    }
    
    function crearOrden (){
      if (carrito.length > 0){
        const nuevaOrden = {
          nombre: "Paula",
          productos: carrito.map(item => {
            // console.log("Verificando producto:", item);

            if (!item.id || !item.cantidad || !item.valor || !item.nombre) {
              throw new Error("Producto con datos incompletos en el carrito");
            }
            return {
              id: item.id,
              cantidad: item.cantidad,
              valor: item.valor,
              nombre: item.nombre
            };
          }),
          
        };
       
        addDoc(ordersCollection, nuevaOrden).then(response =>{ 
          //console.log("orden creada con el id:", response.id); 
          setCarrito([]);
        }).catch (err => {
          console.error(err)
          alert ("Por favor intente de nuevo en unos minutos");
          Swal.fire({
            icon: "error",
            title: "Algo salió mal",
            text: "Por favor intentá de nuevo en unos minutos",
            
          });
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Tu carrito está vacío",
          text: "Podés ver y agregar los equipos que quieras desde la sección de productos",
          
        });
      }   
    };
    
    const removeItem = (id) => {
      const carritoAuxiliar = carrito.filter(prod => prod.id !== id)
      setCarrito (carritoAuxiliar)
  }

  const clearCart = () => {
    Swal.fire({
      title: "¿Querés borrar todo el carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Carrito vacío",
          icon: "success"
        });
        setCarrito ([]);
      } else{
        carrito()
      }
      
    });
    
  }

  const isInCart = (id) =>{
      return carrito.some(prod => prod.id === id)
  }
  
  return (
    <div>
      <AppContext.Provider value={{productos, carrito,  setCarrito, cargarData, agregarAlCarrito, crearOrden, isLoading, isInCart, removeItem, clearCart}}>
      
       {props.children}
      </AppContext.Provider>
    </div>
  )
}
