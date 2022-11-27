import { apiUrl } from '../support/util'

describe('auth', () => {
  function visit (path: string) {
    cy.interceptApi('POST', 'stats', { statusCode: 204 })

    cy.visit(path, {
      onBeforeLoad (win) {
        win.localStorage.now = '2022-10-10'
        win.localStorage.apiUrl = apiUrl
      },
    })
  }

  function visitThen401 () {
    cy.interceptApi('GET', 'shows', { statusCode: 401 })
    cy.interceptApi('GET', 'user', { statusCode: 401 })

    visit('/')
  }

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('shows auth page when visiting it directly', () => {
    visit('/auth')
    cy.contains('Your API key is missing or invalid. Please authenticate.')
  })

  it('shows auth page when api returns 401', () => {
    visitThen401()
    cy.contains('Your API key is missing or invalid. Please authenticate.')
  })

  it('auto-focuces the api key input', () => {
    visit('/auth')
    cy.contains('label', 'API Key').next().should('be.focused')
  })

  it('authenticates with correct api key', () => {
    visit('/auth')

    cy.interceptApi('GET', 'shows', { fixture: 'shows.json' }).as('getShows')
    cy.interceptApi('GET', 'user', { fixture: 'user.json' })

    cy.contains('label', 'API Key').next().type('apikey{enter}')
    cy.wait('@getShows').its('request.headers.api-key').should('equal', 'apikey')
  })

  it('does not authenticate with incorrect api key', () => {
    visit('/auth')

    cy.interceptApi('GET', 'shows', { statusCode: 401 }).as('getShows')
    cy.interceptApi('GET', 'user', { statusCode: 401 })

    cy.contains('label', 'API Key').next().type('nope{enter}')
    cy.wait('@getShows')
    cy.url().should('equal', 'http://localhost:8080/auth')
  })
})
