import React from 'react'
import './notfound.css'


const NOtFound = () => {
  return (
    <div className='notfoundpage' >
      <video autoPlay height={100} width={100}>
          <source src='../../../public/404page.mp4'></source>
        </video> 
    </div>
  )
}

export default NOtFound
