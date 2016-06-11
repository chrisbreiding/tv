Cypress.addParentCommand 'visitAuthed', (path) ->
  cy.server().visit "/##{path}", {
      onBeforeLoad: (win) ->
        win.localStorage.setItem 'apiKey', Cypress.env('apiKey')
    }
