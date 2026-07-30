import employeesAndObjects from './employees-and-objects'
import scheduleManagement from './schedule-management'
import payroll from './payroll'
import employeeMonitoring from './employee-monitoring'
import companyManagement from './company-management'

export const features = {
  [companyManagement.slug]: companyManagement,

  [employeesAndObjects.slug]: employeesAndObjects,

  [scheduleManagement.slug]: scheduleManagement,

  [employeeMonitoring.slug]: employeeMonitoring,

  [payroll.slug]: payroll,
}
