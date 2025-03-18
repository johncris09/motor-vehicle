import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Office = React.lazy(() => import('./views/office/Office'))
const Report = React.lazy(() => import('./views/report/Report'))
const PreviousRecord = React.lazy(() => import('./views/previous_record/PreviousRecord'))
const MotorVehicle = React.lazy(() => import('./views/motor_vehicle/MotorVehicle'))
const User = React.lazy(() => import('./views/user/User'))

const routes = [
  {
    path: '/dashboard',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/report',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Report',
    element: Report,
  },
  {
    path: '/motor_vehicle',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Motor Vehicle',
    element: MotorVehicle,
  },
  {
    path: '/office',
    user: ['Super Admin'],
    exact: true,
    name: 'Office',
    element: Office,
  },
  {
    path: '/previous_record',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'MotorVehicle',
    element: PreviousRecord,
  },

  { path: '/user', user: ['Super Admin'], name: 'User', element: User },
]

export default routes
