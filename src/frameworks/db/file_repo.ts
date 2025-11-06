import { promises as fs } from 'fs'
import path from 'path'
import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'
import { ProductReaderAll } from '../../domain/ports/products/list_all'

type StoreShape = Record<string, Product>

// Étape 5 — À implémenter: persistance fichier (JSON) + rechargement
// Voir src/frameworks/db/file_repo.spec.ts pour les attentes.
export class FileRepo implements ProductReader, ProductWriter, ProductReaderAll {
  private db: Map<string, Product> = new Map()
  private loaded = false

  constructor(private filePath: string) {}

  private async load() {
    if (this.loaded) return
    
    try {
      const data = await fs.readFile(this.filePath, 'utf-8')
      const store: StoreShape = JSON.parse(data)
      
      for (const [id, product] of Object.entries(store)) {
        // Filtrer les entrées valides
        if (product && typeof product.id === 'string' && typeof product.name === 'string' && typeof product.stock === 'number' && product.id === id) {
          this.db.set(id, product)
        }
      }
    } catch (error: any) {
      // Fichier inexistant ou JSON invalide → démarrer avec Map vide
      this.db.clear()
    }
    
    this.loaded = true
  }

  private async persist() {
    // S'assurer que le dossier existe
    await fs.mkdir(path.dirname(this.filePath), { recursive: true })
    
    // Construire l'objet StoreShape
    const store: StoreShape = {}
    for (const [id, product] of this.db.entries()) {
      store[id] = product
    }
    
    // Écrire le JSON
    await fs.writeFile(this.filePath, JSON.stringify(store, null, 2), 'utf-8')
  }

  async getById(id: string): Promise<Product | null> {
    await this.load()
    return this.db.get(id) ?? null
  }

  async save(product: Product): Promise<void> {
    await this.load()
    this.db.set(product.id, product)
    await this.persist()
  }

  async listAll(): Promise<Product[]> {
    await this.load()
    return Array.from(this.db.values())
  }
}
