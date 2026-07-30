import construction from './construction'
import cleaning from './cleaning'
import security from './security'
import cafe from './cafe'
import restaurants from './restaurants'
import coffeeShops from './coffee-shops'
import retail from './retail'
import warehouses from './warehouses'
import propertyManagement from './property-management'
import autoServices from './auto-services'
import hotels from './hotels'
import medicalCenters from './medical-centers'
import {
  FaBroom,
  FaBuilding,
  FaCarSide,
  FaCoffee,
  FaHardHat,
  FaHospital,
  FaHotel,
  FaMugHot,
  FaShieldAlt,
  FaStore,
  FaUtensils,
  FaWarehouse,
} from 'react-icons/fa'

export const solutionIcons = {
  construction: FaHardHat,
  cleaning: FaBroom,
  security: FaShieldAlt,
  cafe: FaMugHot,
  restaurants: FaUtensils,
  'coffee-shops': FaCoffee,
  retail: FaStore,
  warehouses: FaWarehouse,
  'property-management': FaBuilding,
  'auto-services': FaCarSide,
  hotels: FaHotel,
  'medical-centers': FaHospital,
}

export const solutions = {
  [construction.slug]: construction,

  [cleaning.slug]: cleaning,

  [security.slug]: security,

  [cafe.slug]: cafe,

  [restaurants.slug]: restaurants,

  [coffeeShops.slug]: coffeeShops,

  [retail.slug]: retail,

  [warehouses.slug]: warehouses,

  [propertyManagement.slug]: propertyManagement,

  [autoServices.slug]: autoServices,

  [hotels.slug]: hotels,

  [medicalCenters.slug]: medicalCenters,
}

export default solutions
