import { API_BASE_URL } from '@/lib/apiBase'

import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCart } from './redux/productsSlice'
import ProtectedRoute from './components/ui/ProtectedRoute'
import ErrorPage from './components/ui/ErrorPage'
import { Skeleton } from './components/ui/skeleton'

const Home = lazy(() => import('./pages/Home'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const Verify = lazy(() => import('./pages/verify'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const Profile = lazy(() => import('./pages/Profile'))
const Products = lazy(() => import('./pages/Products'))
const Cart = lazy(() => import('./pages/Cart'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminSales = lazy(() => import('./pages/admin/AdminSales'))
const AdminProduct = lazy(() => import('./pages/admin/AdminProduct'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const UserInfo = lazy(() => import('./pages/admin/UserInfo'))
const Addproduct = lazy(() => import('./pages/admin/Addproduct'))
const ShowUserOrders = lazy(() => import('./pages/admin/ShowUserOrders'))
const SingleProduct = lazy(() => import('./pages/SingleProduct'))
const AddressForm = lazy(() => import('./pages/AddressForm'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const MyOrder = lazy(() => import('./pages/MyOrder'))

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
    element: <><Navbar /><SingleProduct /><Footer /></>,
    errorElement: <ErrorPage />
  },
  {
    path: '/cart',
    element: <ProtectedRoute><><Navbar /><Cart /><Footer /></></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/address',
    element: <ProtectedRoute><><Navbar /><AddressForm /><Footer /></></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/order-success',
    element: <ProtectedRoute><><Navbar /><OrderSuccess /><Footer /></></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/my-orders',
    element: <ProtectedRoute><><Navbar /><MyOrder /><Footer /></></ProtectedRoute>,
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


const PageFallback = () => (
  <div className="min-h-screen bg-[#f6f8fb]" role="status" aria-label="Loading page">
    <div className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <Skeleton className="h-7 w-20" />
      <Skeleton className="hidden h-10 w-64 rounded-full sm:block" />
      <div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-9 w-20 rounded-xl" /></div>
    </div>
    <main className="mx-auto max-w-[1280px] space-y-6 px-4 py-10 sm:px-6">
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><Skeleton className="aspect-square w-full rounded-none" /><div className="space-y-3 p-4"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-4/5" /><Skeleton className="h-9 w-full" /></div></div>)}
      </div>
    </main>
  </div>
)

const App = () => {
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchCart = async () => {
      if (accessToken) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/v1/cart`, {
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
  }, [accessToken, dispatch, user])

  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}

export default App
