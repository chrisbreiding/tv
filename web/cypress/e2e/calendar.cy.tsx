describe('list view', () => {
  beforeEach(() => {
    cy.load('/calendar')
  })

  describe('navigation', () => {
    it('displays the current month', () => {
      cy.get('.calendar-month').text().should('equal', 'October')
    })

    it('displays the next month after clicking next', () => {
      cy.get('.calendar-next').click()
      cy.get('.calendar-month').text().should('equal', 'November')
    })

    it('displays the previous month after clicking previous', () => {
      cy.get('.calendar-previous').click()
      cy.get('.calendar-month').text().should('equal', 'September')
    })

    it('returns to current month after clicking Today', () => {
      cy.get('.calendar-next').click()
      cy.get('.calendar-next').click()
      cy.get('.calendar-month').text().should('equal', 'December')
      cy.get('.calendar-today').click()
      cy.get('.calendar-month').text().should('equal', 'October')
    })
  })

  describe('dates', () => {
    it('highlights today', () => {
      cy.get('[data-date="2022-10-10"]').should('have.class', 'is-now')
    })

    it('marks neighboring month dates', () => {
      cy.get('[data-date="2022-09-30"]').should('have.class', 'is-neighboring-month')
      cy.get('[data-date="2022-11-01"]').should('have.class', 'is-neighboring-month')
      cy.get('[data-date="2022-10-15"]').should('not.have.class', 'is-neighboring-month')
    })

    it('marks weekend dates', () => {
      cy.get('[data-date="2022-10-01"]').should('have.class', 'is-weekend')
    })

    it('marks past dates', () => {
      cy.get('[data-date="2022-10-05"]').should('have.class', 'is-past')
    })
  })

  describe('shows', () => {
    it('displays shows that air on each day', () => {
      cy.get('[data-date="2022-10-07"]').find('li').text()
      .should('equal', 'Rings of Power')
      cy.get('[data-date="2022-10-24"]').find('li').text()
      .should('deep.equal', ['Avenue 5', 'House of the Dragon'])
    })

    it('shows the number of episodes if more than one', () => {
      cy.get('[data-date="2022-10-23"]').find('li').text()
      .should('equal', 'House of the Dragon (5)')
    })

    it('dates with shows are links, dates without shows are not', () => {
      cy.get('[data-date="2022-10-07"]').should('match', 'a')
      cy.get('[data-date="2022-10-01"]').should('match', 'div')
    })
  })

  describe('date view', () => {
    it('opens date view when clicking date', () => {
      cy.get('[data-date="2022-10-10"]').click()
      cy.url().should('contain', '/calendar/2022-10-10')
      cy.get('.modal-dialog-overlay.date-shows').should('be.visible')
      cy.get('.modal-dialog h2').text().should('equal', 'October 10, 2022')
      cy.get('.modal-dialog h3').text().should('equal', 'Avenue 5')
      cy.get('.modal-dialog .title').text().should('equal', 'No One Wants an Argument About Reality')
    })

    it('close date view after clicking close', () => {
      cy.get('[data-date="2022-10-10"]').click()
      cy.get('.modal-dialog [title="Close"]').click()
      cy.get('.modal-dialog').should('not.exist')
    })

    it('shows "more" button if more than 3 episodes and does not if less than or equal to 3 episodes', () => {
      cy.get('[data-date="2022-10-23"]').click()
      cy.get('.modal-dialog').contains('House of the Dragon').closest('li').find('.more-less')

      cy.get('.modal-dialog [title="Close"]').click()
      cy.get('[data-date="2022-10-10"]').click()
      cy.get('.modal-dialog').contains('Avenue 5').closest('li').find('.more-less').should('not.exist')
    })

    it('shows all episodes and changes button text after clicking "more"', () => {
      cy.get('[data-date="2022-10-23"]').click()
      cy.get('.modal-dialog').contains('House of the Dragon').closest('li').find('.more-less a').click()

      cy.get('.modal-dialog').contains('House of the Dragon').closest('li').find('.more-less a').text().should('equal', 'less')
      cy.get('.modal-dialog').contains('House of the Dragon').closest('li').find('.upcoming.episode-single .title').text()
      .should('deep.equal', [
        'The Black Queen',
        'The Red Queen',
        'The Blue Queen',
        'The Green Queen',
        'The Aquamarine Queen',
      ])
    })

    it('shows all episodes modal', () => {
      cy.get('[data-date="2022-10-10"]').click()

      cy.get('.modal-dialog').contains('Avenue 5').trigger('mouseover')
      cy.get('[title="All Episodes"]').click()

      cy.url().should('contain', '/calendar/2022-10-10/shows/364106')
    })

    it('shows edit show modal', () => {
      cy.get('[data-date="2022-10-10"]').click()

      cy.get('.modal-dialog').contains('Avenue 5').trigger('mouseover')
      cy.get('[title="Edit"]').click()

      cy.url().should('contain', '/calendar/2022-10-10/shows/364106/edit')
    })
  })
})
