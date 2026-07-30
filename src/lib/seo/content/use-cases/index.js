import scheduleAutomation from './schedule-automation'
import employeeControl from './employee-control'
import payrollAutomation from './payroll-automation'
import attendanceControl from './attendance-control'
import employeeTimeTracking from './employee-time-tracking'
import {
  FaCalendarAlt,
  FaUserCheck,
  FaClock,
  FaMoneyCheckAlt,
  FaClipboardCheck,
} from 'react-icons/fa'

export const useCaseIcons = {
  'schedule-automation': FaCalendarAlt,
  'employee-control': FaUserCheck,
  'attendance-control': FaClipboardCheck,
  'employee-time-tracking': FaClock,
  'payroll-automation': FaMoneyCheckAlt,
}

export const useCases = {
  [scheduleAutomation.slug]: scheduleAutomation,

  [employeeControl.slug]: employeeControl,

  [payrollAutomation.slug]: payrollAutomation,

  [attendanceControl.slug]: attendanceControl,

  [employeeTimeTracking.slug]: employeeTimeTracking,
}
