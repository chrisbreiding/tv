import type { RouteHandler } from 'cypress/types/net-stubbing'
import { apiKey } from '../support/util'

describe('search', () => {
  function search (response: RouteHandler = { fixture: 'search-results' }) {
    cy.interceptApi('GET', 'shows/search?query=Severance', response).as('searchShows')

    cy.get('[title="Add Show"]').click()
    cy.get('input').type('Severance{enter}')

    cy.wait('@searchShows')
  }

  beforeEach(() => {
    cy.load()
  })

  it('auto-focuses search field', () => {
    cy.get('[title="Add Show"]').click()
    cy.focused().should('match', 'input')
    cy.get('.modal-dialog .close').click()
  })

  it('shows search results', () => {
    search()

    cy.get('.results h4').text().should('deep.equal', [
      'Severance',
      'Result 2',
      'Result 3',
      'Result 4',
    ])

    cy.get('.modal-dialog .close').click()
  })

  it('disables already-added shows', () => {
    search()

    cy.get('.results li').first().contains('Show already added')
    cy.get('.results li').first().find('button').should('be.disabled')

    cy.get('.modal-dialog .close').click()
  })

  it('adds show', () => {
    search()

    cy.interceptApi('POST', 'shows', { fixture: 'show' }).as('addShow')
    cy.get('.results li').eq(1).find('button').click()
    cy.wait('@addShow').its('request.body.show').should('deep.equal', {
      description: 'Result 2 description...',
      firstAired: '2016-10-21T04:00:00.000Z',
      id: '318009',
      name: 'Result 2',
      network: 'NRK1',
      poster: `http://localhost:3333/tv/shows/poster/aHR0cHM6Ly9hcnR3b3Jrcy50aGV0dmRiLmNvbS9iYW5uZXJzL3Bvc3RlcnMvMzE4MDA5LTMuanBn?apiKey=${apiKey}`,
      status: 'Continuing',
    })
    cy.contains('h3', 'Result 2')
  })

  it('shows message when no results', () => {
    search({ body: [] })

    cy.contains('No shows found')

    cy.get('.modal-dialog .close').click()
  })

  it('clears results when searching for empty string', () => {
    search()

    cy.get('input').clear().type('{enter}')
    cy.get('.results').should('not.exist')

    cy.get('.modal-dialog .close').click()
  })
})
