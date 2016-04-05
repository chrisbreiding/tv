showsTheMainPage = ->
  cy
    .get('.recent h2').should 'have.text', 'Recent'
    .get('.upcoming h2').should 'have.text', 'Upcoming'
    .get('.off-air h2').should 'have.text', 'Off Air'

describe 'authentication', ->

  describe 'when no api key is set', ->

    beforeEach ->
      cy.server().visit '/'

    it 'shows the auth page', ->
      cy.get '.auth'

    describe 'when a correct api key is typed in', ->

      beforeEach ->
        cy
          .get '.auth input'
          .type Cypress.env('apiKey')
          .get '.auth button'
          .click()

      it 'shows the main page', showsTheMainPage

  describe 'when incorrect api key is set', ->

    beforeEach ->
      cy.server().visit '/', onBeforeLoad: (contentWindow)->
        contentWindow.localStorage.setItem 'apiKey', 'notvalid'

    it 'shows the auth page', ->
      cy.get '.auth'

    it 'shows the api key', ->
      cy.get('.auth input').should 'have.value', 'notvalid'

    describe 'when a correct api key is typed in', ->

      beforeEach ->
        cy
          .get '.auth input'
          .clear()
          .type Cypress.env('apiKey')
          .get '.auth button'
          .click()

      it 'shows the main page', showsTheMainPage

  describe 'when correct api key is set', ->

    beforeEach ->
      cy.server().visit '/', onBeforeLoad: (contentWindow)->
        contentWindow.localStorage.setItem 'apiKey', Cypress.env('apiKey')

    it 'shows the main page', showsTheMainPage
