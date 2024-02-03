import React from 'react'

function MainButton({text, action}) {
    return (
        <button className='mainButton' onClick={action}>
            {text}
      </button>
  )
}

export default MainButton