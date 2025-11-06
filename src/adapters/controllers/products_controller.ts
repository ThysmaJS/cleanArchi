import { AddProduct } from '../../app/usecases/add_product'
import { BuyProduct } from '../../app/usecases/buy_product'
import { GetProduct } from '../../app/usecases/get_product'
import { SearchProducts } from '../../app/usecases/search_products'

type StatusBody = { status: number, body: unknown }

// Étape 4 — À implémenter: mapping entre erreurs métier et codes HTTP
// Indices dans src/adapters/controllers/products_controller.spec.ts
function errorToStatus(err: unknown): number {
  if (err instanceof Error) {
    const message = err.message
    if (message === 'invalid_product' || message === 'invalid_stock' || message === 'invalid_qty') {
      return 400
    }
    if (message === 'not_found') {
      return 404
    }
    if (message === 'insufficient_stock') {
      return 409
    }
  }
  return 500
}

export function buildProductsController(deps: {
  addProduct: AddProduct
  getProduct: GetProduct
  buyProduct: BuyProduct
  searchProducts: SearchProducts
}) {
  return {
    async add(body: any): Promise<StatusBody> {
      try {
        const { id, name, stock } = body
        await deps.addProduct.exec({ id, name, stock })
        return { status: 201, body: {} }
      } catch (err) {
        const status = errorToStatus(err)
        const errorMessage = err instanceof Error ? err.message : 'unknown_error'
        return { status, body: { error: errorMessage } }
      }
    },
    
    async get(id: string): Promise<StatusBody> {
      try {
        const product = await deps.getProduct.exec(id)
        if (!product) {
          return { status: 404, body: { error: 'not_found' } }
        }
        return { status: 200, body: product }
      } catch (err) {
        const status = errorToStatus(err)
        const errorMessage = err instanceof Error ? err.message : 'unknown_error'
        return { status, body: { error: errorMessage } }
      }
    },
    
    async buy(id: string, body: any): Promise<StatusBody> {
      try {
        const { quantity } = body
        const product = await deps.buyProduct.exec(id, quantity)
        return { status: 200, body: product }
      } catch (err) {
        const status = errorToStatus(err)
        const errorMessage = err instanceof Error ? err.message : 'unknown_error'
        return { status, body: { error: errorMessage } }
      }
    },
    
    async search(query: string, limit?: number): Promise<StatusBody> {
      try {
        const products = await deps.searchProducts.exec(query, limit)
        return { status: 200, body: products }
      } catch (err) {
        return { status: 500, body: { error: 'fetch_failed' } }
      }
    }
  }
}
