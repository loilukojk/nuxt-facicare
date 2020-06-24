import Dashboard from './pages/Dashboard';
import Order from './pages/Order';
import OrderDetail from './pages/OrderDetail'
import Technician from './pages/Technician';
import Customer from './pages/Customer';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Logout from './pages/Logout';
import DataSetup from './setup/DataSetup';
import PageNotFound from './pages/PageNotFound';

const routes = [
    {
        path: '/',
        redirect: '/facicare/dashboard',
    },
    {
        path: '/facicare',
        redirect: '/facicare/dashboard',
    },
    {
        path: '/facicare/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/orders',
        name: 'Order',
        component: Order,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/order-detail/:orderid',
        name: 'OrderDetail',
        component: OrderDetail,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/technicians',
        name: 'Technician',
        component: Technician,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/customers',
        name: 'Customer',
        component: Customer,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/user-profile',
        name: 'UserProfile',
        component: UserProfile,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/facicare/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: "/facicare/logout",
        name: 'Logout',
        component: Logout
    },
    {
        path: '/facicare/data-setup',
        name: 'DataSetup',
        component: DataSetup,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "*",
        name: 'PageNotFound',
        component: PageNotFound,
        meta: {
            requiresAuth: true,
        }
    }
]

export default routes
