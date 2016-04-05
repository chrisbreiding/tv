describe 'episodes', ->

  beforeEach ->
    cy
      .server().visit '/#/shows'
      .clearLocalStorage().then (ls)->
        ls.setItem 'apiKey', Cypress.env('apiKey')
        cy.reload()

  describe 'viewing all episodes for a show', ->

    beforeEach ->
      cy.visit '/#/shows/23'

    it 'displays the show name', ->
      cy
        .get '.all-episodes h2'
        .should 'have.text', 'Better Call Saul'

    it 'has the proper file name for any given episode', ->
      cy
        .get('.season').eq(1).find('.file-name').first()
        .should 'have.text', 'Better Call Saul - s01e01 - Uno'
