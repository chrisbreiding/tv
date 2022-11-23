import React from 'react'
import { useNavigate, useParams } from 'react-router'

export const withRouter = (Component) => {
  return (props) => (
    <Component {...props} params={useParams()} navigate={useNavigate()} />
  )
}
