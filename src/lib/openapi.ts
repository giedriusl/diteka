export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Diteka Assessment API',
    version: '1.0.0',
    description: 'Internal API for the Diteka automation readiness assessment.',
  },
  paths: {
    '/api/assessment/stage1': {
      post: {
        summary: 'Submit Stage 1 directional score',
        description:
          'Captures company-wide signals after Step 2. Sends a directional score email and upserts the contact in Brevo.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Stage1Payload' },
              example: {
                email: 'you@company.com',
                language: 'en',
                company_name: 'UAB Example',
                sector: 'manufacturing',
                company_size: 's',
                pain_point: 'staff',
                directional_score: 72,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Accepted (email sent or skipped if BREVO_API_KEY not set)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OkResponse' },
              },
            },
          },
          400: {
            description: 'Invalid email or malformed body',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/assessment/submit': {
      post: {
        summary: 'Submit full assessment results',
        description:
          'Called after email is collected in Step 6. Generates a PDF report, emails it to the user, upserts contact in Brevo, and optionally sends a hot-lead alert.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WebhookPayload' },
            },
          },
        },
        responses: {
          200: {
            description: 'Accepted (email sent or skipped if BREVO_API_KEY not set)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OkResponse' },
              },
            },
          },
          400: {
            description: 'Invalid email or missing processes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/assessment/report': {
      post: {
        summary: 'Generate and download PDF report',
        description:
          'On-demand PDF generation. Returns the report as a binary PDF attachment. Used by the Step 7 "Download PDF" button.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WebhookPayload' },
            },
          },
        },
        responses: {
          200: {
            description: 'PDF file',
            content: {
              'application/pdf': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Stage1Payload: {
        type: 'object',
        required: ['email', 'language', 'company_name', 'sector', 'company_size', 'pain_point', 'directional_score'],
        properties: {
          email: { type: 'string', format: 'email' },
          language: { type: 'string', enum: ['en', 'lt'] },
          company_name: { type: 'string' },
          sector: { type: 'string', enum: ['manufacturing', 'logistics', 'wholesale', 'services', 'retail', 'other'] },
          company_size: { type: 'string', enum: ['xs', 's', 'm', 'l'], description: 'xs=1-10, s=11-50, m=51-200, l=200+' },
          pain_point: { type: 'string', enum: ['staff', 'errors', 'overload', 'compliance', 'volume', 'other'] },
          directional_score: { type: 'number', minimum: 0, maximum: 100 },
        },
      },
      WebhookPayload: {
        type: 'object',
        required: ['email', 'language', 'company_name', 'sector', 'company_size', 'pain_point', 'company_score', 'processes', 'db_module_completed', 'submitted_at'],
        properties: {
          email: { type: 'string', format: 'email' },
          language: { type: 'string', enum: ['en', 'lt'] },
          company_name: { type: 'string' },
          sector: { type: 'string', enum: ['manufacturing', 'logistics', 'wholesale', 'services', 'retail', 'other'] },
          company_size: { type: 'string', enum: ['xs', 's', 'm', 'l'] },
          pain_point: { type: 'string', enum: ['staff', 'errors', 'overload', 'compliance', 'volume', 'other'] },
          company_score: { type: 'number', minimum: 0, maximum: 100 },
          processes: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/WebhookProcessPayload' },
          },
          db_module_completed: { type: 'boolean' },
          db_scores: {
            nullable: true,
            type: 'object',
            properties: {
              M1: { type: 'number', nullable: true },
              M2: { type: 'number', nullable: true },
              M3: { type: 'number', nullable: true },
              M4: { type: 'number', nullable: true },
              M5: { type: 'array', items: { type: 'string' } },
            },
          },
          migration_score: { type: 'number', nullable: true },
          submitted_at: { type: 'string', format: 'date-time' },
        },
      },
      WebhookProcessPayload: {
        type: 'object',
        required: ['name', 'scores', 'process_score', 'hours_per_week', 'annual_hours_saved', 'knockout'],
        properties: {
          name: { type: 'string' },
          scores: {
            type: 'object',
            properties: {
              D1: { type: 'number' }, D2: { type: 'number' }, D3: { type: 'number' },
              D4: { type: 'number' }, D5: { type: 'number' }, D6: { type: 'number' },
              D7: { type: 'number' }, D8: { type: 'number' },
            },
          },
          process_score: { type: 'number', minimum: 0, maximum: 100 },
          hours_per_week: { type: 'number' },
          annual_hours_saved: { type: 'number' },
          knockout: { type: 'string', nullable: true, enum: ['no_compliance', 'no_data_and_rules', null] },
        },
      },
      OkResponse: {
        type: 'object',
        properties: { ok: { type: 'boolean', example: true } },
      },
      ErrorResponse: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
    },
  },
}
