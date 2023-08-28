/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    interceptApi(method: Method, path: string, reply?: RouteHandler): Chainable<null>
    load(path?: string): Chainable<null>
    text(): Chainable<string[] | string>
  }
}
