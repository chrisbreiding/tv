describe('shows', () => {
  beforeEach(() => {
    cy.load('/list')
  })

  describe('all shows', () => {
    beforeEach(() => {
      cy.get('.off-air h3').first().find('span span').trigger('mouseover')
      cy.get('[title="All Episodes"]').click()
    })

    it('shows network and status', () => {
      cy.contains('Network').next().text().should('equal', 'BBC One')
      cy.contains('Status').next().text().should('equal', 'Continuing')
    })

    it('displays all episodes by season', () => {
      cy.get('.modal-dialog h3').text().should('deep.equal', [
        'Season 1',
        'Season 2',
        'Season 3',
        'Specials',
      ])
      cy.get('.modal-dialog .season').eq(0).find('li').should('have.length', 8)
      cy.get('.modal-dialog .season').eq(1).find('li').should('have.length', 7)
      cy.get('.modal-dialog .season').eq(2).find('li').should('have.length', 8)
      cy.get('.modal-dialog .season').eq(3).find('li').should('have.length', 1)
    })

    it('clicking X closes the dialog', () => {
      cy.get('.modal-dialog .close button').click()
      cy.get('.modal-dialog').should('not.exist')
    })
  })

  describe('edit show', () => {
    beforeEach(() => {
      cy.interceptApi('PUT', 'shows/364106', {}).as('updateShow')

      cy.get('.upcoming h3').first().find('span span').trigger('mouseover')
      cy.get('[title="Edit"]').click()
    })

    it('displays fields for display name, search name, and file name', () => {
      cy.contains('Display Name').next().invoke('val').should('equal', 'Avenue 5')
      cy.contains('Search Name').next().invoke('val').should('equal', 'Avenue 5 (search)')
      cy.contains('File Name').next().invoke('val').should('equal', 'Avenue 5 (file)')
      cy.contains('Cancel').click()
    })

    it('auto-focuses the display name field', () => {
      cy.focused().invoke('val').should('equal', 'Avenue 5')
      cy.contains('Cancel').click()
    })

    it('updates the show on save', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 1', { delay: 0 })
      cy.contains('label', 'Search Name').next().clear().type('Search Name Update 1', { delay: 0 })
      cy.contains('label', 'File Name').next().clear().type('File Name Update 1', { delay: 0 })
      cy.contains('Save').click()

      cy.wait('@updateShow').its('request.body.show').should('deep.equal', {
        displayName: 'Display Name Update 1',
        fileName: 'File Name Update 1',
        id: '364106',
        searchName: 'Search Name Update 1',
      })
    })

    it('reflects the changed display name', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 2', { delay: 0 })
      cy.contains('Save').click()
      cy.contains('h3', 'Display Name Update 2')
    })

    it('reflects the changed file name', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 3', { delay: 0 })
      cy.contains('label', 'File Name').next().clear().type('File Name Update 3', { delay: 0 })
      cy.contains('Save').click()
      cy.contains('No One Wants an Argument About Reality').click()
      cy.contains('.file-name', 'File Name Update 3 - s02e01 - No One Wants an Argument About Reality')
    })

    it('reflects the changed search name', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 4', { delay: 0 })
      cy.contains('label', 'Search Name').next().clear().type('Search Name Update 4', { delay: 0 })
      cy.contains('Save').click()
      cy.contains('h3', 'Display Name Update 4').find('span span').trigger('mouseover')
      cy.get('a[title="Search Finder"]').should('have.attr', 'href', 'https://finder.org/search?q=Search Name Update 4')
    })

    it('resets the show values on cancel', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 5', { delay: 0 })
      cy.contains('label', 'File Name').next().clear().type('File Name Update 5', { delay: 0 })
      cy.contains('label', 'Search Name').next().clear().type('Search Name Update 5', { delay: 0 })
      cy.contains('Save').click()

      cy.contains('h3', 'Display Name Update 5').find('span span').trigger('mouseover')
      cy.get('[title="Edit"]').click()

      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 6', { delay: 0 })
      cy.contains('label', 'File Name').next().clear().type('File Name Update 6', { delay: 0 })
      cy.contains('label', 'Search Name').next().clear().type('Search Name Update 6', { delay: 0 })
      cy.contains('Cancel').click()

      cy.contains('h3', 'Display Name Update 5').find('span span').trigger('mouseover')
      cy.get('[title="Edit"]').click()

      cy.contains('label', 'Display Name').next().invoke('val').should('equal', 'Display Name Update 5')
      cy.contains('label', 'File Name').next().invoke('val').should('equal', 'File Name Update 5')
      cy.contains('label', 'Search Name').next().invoke('val').should('equal', 'Search Name Update 5')
      cy.contains('Cancel').click()
    })

    it('cancels deletion', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 7', { delay: 0 })
      cy.contains('Save').click()

      cy.contains('h3', 'Display Name Update 7').find('span span').trigger('mouseover')
      cy.get('[title="Edit"]').click()

      cy.contains('Delete show').click()
      cy.get('.confirm-delete-modal').contains('Cancel').click()

      cy.contains('label', 'Display Name').should('be.visible')
      cy.contains('Cancel').click()
      cy.contains('h3', 'Display Name Update 7')
    })

    it('confirms deletion', () => {
      cy.contains('label', 'Display Name').next().clear().type('Display Name Update 8', { delay: 0 })
      cy.contains('Save').click()

      cy.contains('h3', 'Display Name Update 8').find('span span').trigger('mouseover')
      cy.get('[title="Edit"]').click()

      cy.interceptApi('DELETE', 'shows/364106', { status: 204 }).as('deleteShow')

      cy.contains('Delete show').click()
      cy.contains('.ok', 'Delete').click()
      cy.contains('h3', 'Display Name Update 8').should('not.exist')

      cy.wait('@deleteShow')
    })
  })
})
