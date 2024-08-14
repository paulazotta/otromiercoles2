import React from 'react'
import BotonAgregarCarrito from '../BotonAgregarCarrito/BotonAgregarCarrito'
// import './cardDetalle.css'

function DetalleProductos({id, img, nombre, caracteristicas}) {
  return (
    <div key={id} className='cardDetalle'>
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">{caracteristicas}</p>
        <img src={img} className="card-img-top imgCard" alt={nombre} />
        <BotonAgregarCarrito/>
    </div>
  )
}

export default DetalleProductos
