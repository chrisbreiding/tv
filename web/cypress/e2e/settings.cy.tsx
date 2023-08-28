describe('settings', () => {
  describe('single visit, multiple tests', () => {
    beforeEach(() => {
      cy.load('/settings')
      cy.interceptApi('PUT', 'user', { statusCode: 204 }).as('updateUser')
    })

    it('displays hide options, search links, and last updated', () => {
      cy.contains('Hide from Recent & Upcoming')
      cy.contains('Search Links')
      cy.get('footer p').text().should('include', 'Shows & episodes last updated: Oct 8, 2022')
    })

    it('shows warning when last updated was over a day ago and user is admin', () => {
      cy.get('footer .outdated-warning').should('be.visible')
      cy.get('footer .outdated-warning').trigger('mouseover')
      cy.get('.tooltip').text().should('equal', 'Last update was over 24 hours ago')
      cy.get('header .outdated-warning').should('be.visible')
    })

    it('saves preferred view to localStorage', () => {
      cy.contains('Preferred View').next('.select').contains('Calendar').as('calendarSelect')
      cy.get('@calendarSelect').click()
      cy.get('@calendarSelect').should('have.class', 'selected')
      cy.contains('Save').click()

      cy.window().its('localStorage.preferredView').should('equal', 'calendar')
    })

    it('loads preferred view for /', () => {
      cy.contains('Preferred View').next('.select').contains('Calendar').click()
      cy.contains('Save').click()

      cy.visit('/')
      cy.url().should('contain', '/calendar')
    })

    it('redirects 404s to preferred view', () => {
      cy.contains('Preferred View').next('.select').contains('Calendar').click()
      cy.contains('Save').click()

      cy.visit('/nope')
      cy.url().should('contain', '/calendar')
    })

    it('shows special episodes when they are unhidden', () => {
      cy.contains('Special episodes').click()
      cy.contains('Save').click()

      cy.get('[title="List View"]').click()
      cy.contains('Inside the Episode - The Green Council').should('be.visible')
    })

    it('shows TBA episodes when they are unhidden', () => {
      cy.contains('Episodes where date and title are TBA').click()
      cy.contains('Save').click()

      cy.get('[title="List View"]').click()
      cy.contains('301')
      cy.contains('302')
      cy.contains('303')
    })

    it('changes search links when they are updated', () => {
      cy.contains('label', 'Show Link').first().next().clear().type('https://updated.show.link', { delay: 0 })
      cy.contains('label', 'Episode Link').first().next().clear().type('https://updated.episode.link', { delay: 0 })
      cy.contains('button', 'Add Link').click()
      cy.get('fieldset').eq(2).within(() => {
        cy.contains('label', 'Name').next().clear().type('New Search', { delay: 0 })
        cy.contains('label', 'Show Link').next().clear().type('https://new.show.link', { delay: 0 })
        cy.contains('label', 'Episode Link').next().clear().type('https://new.episode.link', { delay: 0 })
      })
      cy.contains('Save').click()

      cy.get('[title="List View"]').click()
      cy.get('.upcoming h3').first().find('span span').trigger('mouseover')
      cy.get('a[title="Search Finder"]').should('have.attr', 'href', 'https://updated.show.link')
      cy.get('a[title="Search New Search"]').should('have.attr', 'href', 'https://new.show.link')
      cy.get('.upcoming h3').first().find('span span').trigger('mouseout')

      cy.get('.upcoming .episode-number span').first().trigger('mouseover')
      cy.get('a[title="Search Finder"]').should('have.attr', 'href', 'https://updated.episode.link')
      cy.get('a[title="Search New Search"]').should('have.attr', 'href', 'https://new.episode.link')
    })

    it('sends the settings on save', () => {
      cy.contains('Special episodes').click()
      cy.contains('Episodes where date and title are TBA').click()
      cy.contains('label', 'Name').first().next().clear().type('Name Update', { delay: 0 })
      cy.contains('label', 'Show Link').first().next().clear().type('Show Link Update', { delay: 0 })
      cy.contains('label', 'Episode Link').first().next().clear().type('Episode Link Update', { delay: 0 })
      cy.get('fieldset').eq(1).contains('Delete').click()
      cy.contains('Save').click()

      cy.wait('@updateUser').its('request.body').should('deep.equal', {
        hideSpecialEpisodes: false,
        hideTBAEpisodes: 'NONE',
        searchLinks: [
          {
            episodeLink: 'Episode Link Update',
            name: 'Name Update',
            showLink: 'Show Link Update',
          },
        ],
      })
    })
  })
})
