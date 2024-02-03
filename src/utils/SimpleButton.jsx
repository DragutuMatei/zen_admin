import React from 'react'

function SimpleButton({text, action}) {
    return (
        <button className='simpleButton' onClick={action}>
        {text}
  </button>

  )
}

export default SimpleButton