
// import {SearchBar} from "../components/search-bar"

import {Sidebar} from "../../components/sidebar"
import { Header } from "../../components/header"
import { UserManagement } from "../../components/user-management"


export default function userLayout() {
  return (
    <div className="dashboard-container">
        <Header title="Configuracion de Clientes" />     
      <div className="dashboard-content">
      <Sidebar/>
        <div className="products-container"> 
              
         <UserManagement />
        </div>        
          
        
      </div>
    </div>
  )
}
