import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilBusAlt, cilCarAlt, cilFile, cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = []

  // Super Admin
  if (userInfo.role_type === 'Super Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Motor Vehicle',
        to: '/motor_vehicle',
        icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Previous Record',
      //   to: '/previous_record',
      //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  // Super Admin
  if (userInfo.role_type === 'Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Motor Vehicle',
        to: '/motor_vehicle',
        icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Previous Record',
      //   to: '/previous_record',
      //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
    ]
  }
  return items
}

export default _nav
