import React from 'react'
import './notfound.css'


const NOtFound = () => {
  return (
    <div className='notfoundpage' >
      <video autoPlay loop height={100} width={100} controls>
          <source src='../../../public/404page.mp4'></source>
        </video> 
    </div>
  )
}

export default NOtFound
