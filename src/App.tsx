import { Routes, Route } from "react-router-dom"
import { AppProvider } from "./contexts/app-provider"
import Dashboard from "./pages/HomePage"
// import ProductsPage from "./pages/ProductsPage"
// import OrdersPage from "./pages/OrdersPage"
// import CatalogPage from "./pages/CatalogPage"
// import CustomersPage from "./pages/CustomersPage"
// import TransactionsPage from "./pages/TransactionsPage"
// import FinancesPage from "./pages/FinancesPage"
// import StatisticsPage from "./pages/StatisticsPage"
// import UsersPage from "./pages/UsersPage"
// import SettingsPage from "./pages/SettingsPage"
// import Layout from "./components/layout"

function App() {
  return (
    <AppProvider>
     
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/productos" element={<ProductsPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/transacciones" element={<TransactionsPage />} />
          <Route path="/finanzas" element={<FinancesPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/configuraciones" element={<SettingsPage />} /> */}
        </Routes>
     
    </AppProvider>
  )
}

export default App
