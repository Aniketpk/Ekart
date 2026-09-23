import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children,adminOnly =false}) => {
    const {user} = useSelector((state )=> state.user)
    if(!user){
        return <Navigate to="/login" />
    }
    if(adminOnly && user.role !== 'admin'){
        return <Navigate to="/" />
    }
    return children
}

export default ProtectedRoute