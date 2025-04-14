import{ ProductGrid} from "../components/product-grid"
// import {SearchBar} from "../components/search-bar"
import {CartSidebar} from "../components/cart-sidebar"
import {Sidebar} from "../components/sidebar"
import { Header } from "../components/header"
import { SearchBar } from "../components/search-bar"


export default function HomePage() {
  return (
    <div className="dashboard-container">
        <Header title="Dashboard" />
      {/* <SearchBar /> */}
      <div className="dashboard-content">
      <Sidebar/>
        <div className="products-container"> 
            <SearchBar />      
          <ProductGrid />
        </div>        
          <CartSidebar />
        
      </div>
    </div>
  )
}
