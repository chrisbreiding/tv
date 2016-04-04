VALID_API_KEY = 'ZEvJD8kJQ8d7bykLpRJR'

showsTheMainPage = ->
  cy
    .get('.recent h2').should 'have.text', 'Recent'
    .get('.upcoming h2').should 'have.text', 'Upcoming'
    .get('.off-air h2').should 'have.text', 'Off Air'

describe 'authentication', ->

  beforeEach ->
    cy.visit 'http://localhost:8000'

  it 'has the correct title', ->
    cy.title().should 'include', 'Episodes'

  describe 'when no api key is set', ->

    it 'shows the auth page', ->
      cy.get '.auth'

    describe 'when a correct api key is typed in', ->

      beforeEach ->
        cy
          .get '.auth input'
          .type VALID_API_KEY
          .get '.auth button'
          .click()

      it 'shows the main page', showsTheMainPage

  describe 'when incorrect api key is set', ->

    beforeEach ->
      cy.clearLocalStorage().then (ls)->
        ls.setItem 'apiKey', 'notvalid'

    it 'shows the auth page', ->
      cy.get '.auth'

    describe 'when a correct api key is typed in', ->

      beforeEach ->
        cy
          .get '.auth input'
          .clear()
          .type VALID_API_KEY
          .get '.auth button'
          .click()

      it 'shows the main page', showsTheMainPage

  describe 'when correct api key is set', ->

    beforeEach ->
      cy.clearLocalStorage().then (ls)->
        ls.setItem 'apiKey', VALID_API_KEY
        cy.reload()

    it 'shows the main page', showsTheMainPage
