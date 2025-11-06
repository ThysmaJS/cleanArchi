import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'
import { ProductReaderAll } from '../../domain/ports/products/list_all'

// Étape 1 — À implémenter par les étudiants
// Objectif: déposer en mémoire (Map) pour lire/écrire/lister des produits.
// Voir les attentes dans: src/adapters/gateways/memory_products.spec.ts
export class MemoryProductsGateway implements ProductReader, ProductWriter, ProductReaderAll {
  private products = new Map<string, Product>()

  getById(id: string): Product | null {
    return this.products.get(id) || null
  }

  save(product: Product): void {
    this.products.set(product.id, product)
  }

  listAll(): Product[] {
    return Array.from(this.products.values())
  }
}
