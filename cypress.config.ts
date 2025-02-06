import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents() {
      // implement node event listeners here
      // and load any plugins that require the Node environment
    },
  },
  env: {
    // Environment variables for tests
    apiUrl: 'http://localhost:3000',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
});
