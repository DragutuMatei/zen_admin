import React from 'react'

function SecondButton({text, action}) {
    return (
        <button className='secondButton' onClick={action}>
        {text}
        </button>
    )
}

export default SecondButton