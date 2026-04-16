// server/api/admin/articles/index.get.ts
// Admin — lista todos os artigos (drafts + publicados).
// Protegido por server/middleware/admin-auth.ts
import { getAllArticles } from '../../../utils/storage'

export default defineEventHandler(async () => {
  return getAllArticles(false)
})
