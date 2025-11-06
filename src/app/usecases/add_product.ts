import { Product } from '../../domain/product'
import { ProductWriter } from '../../domain/ports/products/writer'

// Étape 2 — À implémenter: validation et sauvegarde via le port ProductWriter
export class AddProduct {
  constructor(private writer: ProductWriter) {}

  async exec(p: Product): Promise<void> {
    // Validation: id et name non vides
if (!p.id || !p.name) {
      throw new Error('invalid_product')
    }
    
    // Validation: stock >= 0
    if (p.stock < 0) {
      throw new Error('invalid_stock')
    }
    
    // Sauvegarde via le port
    await this.writer.save(p)
  }
}
