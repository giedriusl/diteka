import { ApiReference } from '@scalar/nextjs-api-reference'
import { openApiSpec } from '@/lib/openapi'

export const GET = ApiReference({
  spec: { content: openApiSpec },
  pageTitle: 'Diteka API Docs',
})
