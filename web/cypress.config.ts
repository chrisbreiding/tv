import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'bufi66',
  video: false,
  e2e: {
    baseUrl: 'http://localhost:8080',
    experimentalSessionAndOrigin: true,
    testIsolation: 'off',
  },
})
