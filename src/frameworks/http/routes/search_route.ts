import { Router } from 'express'

// TODO Exercice 7: Implémenter la route GET /search?query=&limit=
// - Déléguer à controller.search(query, limit)
// - Répondre avec le status/JSON du controller
type StatusBody = { status: number, body: unknown }
export function searchRouter(controller: {
  search: (query: string, limit?: number) => Promise<StatusBody>
}): Router {
  const router = Router()
  
  router.get('/search', async (req, res) => {
    const query = req.query.query as string || ''
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    
    const result = await controller.search(query, limit)
    res.status(result.status).json(result.body)
  })
  
  return router
}
