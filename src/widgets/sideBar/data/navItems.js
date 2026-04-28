import { FaBuilding, FaCalendarAlt, FaCalendarCheck, FaHome, FaUserTie } from 'react-icons/fa'

export const navItems = [
  { label: 'CRM', href: '/bc', icon: <FaHome /> },
  { label: 'Объекты', href: '/bc/object', icon: <FaBuilding /> },
  { label: 'Охранники', href: '/bc/security', icon: <FaUserTie /> },
  { label: 'Календарь на день', href: '/bc/calendar-today', icon: <FaCalendarCheck /> },
  { label: 'Общий календарь', href: '/bc/calendar-all-objects', icon: <FaCalendarAlt /> },
]
