import { defineConfig } from 'orval'

export default defineConfig({
  stallionAdmin: {
    input: {
      target: './openapi/stallion-openapi.json',
      filters: {
        tags: ['Admin'],
      },
    },
    output: {
      target: './lib/api/generated/admin/admin-sdk.ts',
      schemas: './lib/api/generated/admin/model',
      client: 'axios',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './lib/api/orval/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
  stallionHackathons: {
    input: {
      target: './openapi/stallion-openapi.json',
      filters: {
        tags: ['Hackathons'],
      },
    },
    output: {
      target: './lib/api/generated/hackathons/hackathons-sdk.ts',
      schemas: './lib/api/generated/hackathons/model',
      client: 'axios',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './lib/api/orval/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
