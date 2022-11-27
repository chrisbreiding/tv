import type { Method, RouteHandler, StringMatcher } from 'cypress/types/net-stubbing'
import { apiKey, apiUrl } from './util'

function optionsHeaders (method: string) {
  return {
    'access-control-allow-origin': Cypress.config('baseUrl'),
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'api-key,content-type',
    'access-control-allow-methods': method,
  }
}

Cypress.Commands.add('interceptApi', (method: Method, path: string, reply?: RouteHandler) => {
  cy.intercept('OPTIONS', `${apiUrl}/${path}`, { statusCode: 204, headers: optionsHeaders(method) })
  return cy.intercept(method, `${apiUrl}/${path}` as StringMatcher, reply)
})

Cypress.Commands.add('load', () => {
  cy.interceptApi('POST', 'stats', { statusCode: 204 })
  cy.interceptApi('GET', 'shows', { fixture: 'shows.json' }).as('getShows')
  cy.interceptApi('GET', 'user', { fixture: 'user.json' }).as('getUser')

  cy.clearLocalStorage()
  cy.visit('/', {
    onBeforeLoad (win) {
      win.localStorage.now = '2022-10-10'
      win.localStorage.apiKey = apiKey
      win.localStorage.apiUrl = apiUrl
    },
  })

  cy.wait('@getShows')
})

Cypress.Commands.add(
  'text',
  { prevSubject: ['element'] },
  (subject: Cypress.JQueryWithSelector<HTMLElement>) => {
    const texts = subject.map((_, el) => el.innerText).get()

    return cy.wrap(texts.length === 1 ? texts[0] : texts)
  },
)
