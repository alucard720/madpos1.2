import type { Product } from "../contexts/product-context"

// MockAPI URL - replace with your actual MockAPI endpoint
const MOCKAPI_URL = "https://localhost:8184/v1/products"

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(MOCKAPI_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    // If the API is down or not available, use fallback data
    if (!data || data.length === 0) {
      return getFallbackProducts()
    }

    return data
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return fallback data if the API call fails
    return getFallbackProducts()
  }
}

// Fallback data in case the API is unavailable
function getFallbackProducts(): Product[] {
  return [

    {
      id: "hol004",
      name: "Holdla",
      price: 123.0,
      category: "Servicios",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "ran005",
      name: "Rank",
      price: 200.0,
      category: "Software",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "reg006",
      name: "Regran",
      price: 231.0,
      category: "Servicios",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "sti007",
      name: "Stim",
      price: 1231.0,
      category: "Electrónicos",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "str008",
      name: "String",
      price: 234.0,
      category: "Materiales",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "tem009",
      name: "Temp",
      price: 100.0,
      category: "Hogar",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      id: "wra010",
      name: "Wrapsa",
      price: 2213.0,
      category: "Embalaje",
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
  ]
}
