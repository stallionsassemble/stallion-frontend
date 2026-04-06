import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const SWAGGER_INIT_URL = 'https://api.stallion.so/api/docs/docs/swagger-ui-init.js'
const OUTPUT_PATH = resolve('openapi/stallion-openapi.json')
const START_MARKER = '"swaggerDoc": '
const END_MARKER = '\n  "customOptions": {}'

const response = await fetch(SWAGGER_INIT_URL)

if (!response.ok) {
  throw new Error(`Failed to fetch Swagger UI init file: ${response.status} ${response.statusText}`)
}

const script = await response.text()
const startIndex = script.indexOf(START_MARKER)
const endIndex = script.indexOf(END_MARKER, startIndex)

if (startIndex === -1 || endIndex === -1) {
  throw new Error('Could not locate embedded OpenAPI document in Swagger UI init file')
}

const rawJson = script
  .slice(startIndex + START_MARKER.length, endIndex)
  .trim()
  .replace(/,\s*$/, '')

const spec = JSON.parse(rawJson)

for (const pathItem of Object.values(spec.paths || {})) {
  for (const operation of Object.values(pathItem || {})) {
    if (!operation || typeof operation !== 'object' || !('responses' in operation)) {
      continue
    }

    for (const response of Object.values(operation.responses || {})) {
      if (response && typeof response === 'object' && 'schema' in response) {
        delete response.schema
      }
    }
  }
}

for (const scheme of Object.values(spec.components?.securitySchemes || {})) {
  if (scheme?.type === 'http') {
    delete scheme.name
    delete scheme.in
  }
}

await mkdir(dirname(OUTPUT_PATH), { recursive: true })
await writeFile(OUTPUT_PATH, `${JSON.stringify(spec, null, 2)}\n`)

console.log(`Saved OpenAPI spec to ${OUTPUT_PATH}`)
