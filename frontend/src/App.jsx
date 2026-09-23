
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/ui/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCart } from './redux/productsSlice'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import Addproduct from './pages/admin/Addproduct'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import SingleProduct from './pages/SingleProduct'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'
import MyOrder from './pages/MyOrder'
import ErrorPage from './components/ui/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <><Signup /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <><Login /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/verify',
    element: <><Verify /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/profile/:userId',
    element: <ProtectedRoute><Navbar /><Profile /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/products',
    element: <><Navbar /><Products /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SingleProduct /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/cart',
    element: <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/address',
    element: <ProtectedRoute><AddressForm /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/order-success',
    element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/my-orders',
    element: <ProtectedRoute><Navbar /><MyOrder /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },

  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><><Navbar /><Dashboard /></></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'sales',
        element: <AdminSales />
      },
      {
        path: 'products',
        element: <AdminProduct />
      },
      {
        path: 'orders',
        element: <AdminOrders />
      },
      {
        path: 'users',
        element: <AdminUsers />
      },
      {
        path: 'users/:id',
        element: <UserInfo />
      },
      {
        path: 'add-product',
        element: <Addproduct />
      },
      {
        path: 'users/orders/:userId',
        element: <ShowUserOrders />
      }
    ]
  }
]
)


const App = () => {
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchCart = async () => {
      if (accessToken) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/cart`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
          })
          if (res.data.success) {
            dispatch(setCart(res.data.cart))
          }
        } catch (error) {
          console.log('Error fetching cart:', error)
        }
      }
    }
    fetchCart()
  }, [accessToken, dispatch])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

