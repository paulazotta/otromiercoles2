import React from 'react';
import bolsa from './assets/bolsa.svg';
import './CartWidget.css';
import { useAppContext } from "../Context/Context";


function CartWidget() {
  const {carrito, crearOrden} = useAppContext();
  const handleCarrito = () => { 
    crearOrden();
  }
  return (
    <div onClick={() => handleCarrito()}>
      <img src={bolsa} alt="bolsa-compras"  className='cartWidget' />
      <p>{carrito.length}</p>
    </div>
  )
}

export default CartWidget