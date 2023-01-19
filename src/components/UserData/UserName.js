import React from 'react'
import './UserName.scss'

const UserName = (props) => {
  return (
    <h1 className='header-user__name'>{props.name}</h1>
  )
}

export default UserName