describe('settings', () => {
  before(() => {
    cy.load()
  })

  beforeEach(() => {
    cy.get('[title="Settings"]').click()
  })

  it('displays hide options, search links, and last updated', () => {
    cy.contains('Hide from Recent & Upcoming')
    cy.contains('Search Links')
    cy.get('.modal-dialog footer p').text().should('include', 'Shows & episodes last updated: Oct 8, 2022')
    cy.contains('Cancel').click()
  })

  it('shows warning when last updated was over a day ago and user is admin', () => {
    cy.get('.modal-dialog footer .outdated-warning').should('be.visible')
    cy.get('.modal-dialog footer .outdated-warning').trigger('mouseover')
    cy.get('.tooltip').text().should('equal', 'Last update was over 24 hours ago')
    cy.contains('Cancel').click()
    cy.get('.app-options .outdated-warning').should('be.visible')
  })

  it('shows special episodes when they are unhidden', () => {
    cy.interceptApi('PUT', 'user', { statusCode: 204 })

    cy.contains('Special episodes').click()
    cy.contains('Save').click()
    cy.contains('Inside the Episode - The Green Council').should('be.visible')
  })

  it('shows TBA episodes when they are unhidden', () => {
    cy.interceptApi('PUT', 'user', { statusCode: 204 })

    cy.contains('Episodes where date and title are TBA').click()
    cy.contains('Save').click()
    cy.contains('301')
    cy.contains('302')
    cy.contains('303')
  })

  it('changes search links when they are updated', () => {
    cy.interceptApi('PUT', 'user', { statusCode: 204 })

    cy.contains('label', 'Show Link').first().next().clear().type('https://updated.show.link', { delay: 0 })
    cy.contains('label', 'Episode Link').first().next().clear().type('https://updated.episode.link', { delay: 0 })
    cy.contains('button', 'Add Link').click()
    cy.get('fieldset').eq(2).within(() => {
      cy.contains('label', 'Name').next().clear().type('New Search', { delay: 0 })
      cy.contains('label', 'Show Link').next().clear().type('https://new.show.link', { delay: 0 })
      cy.contains('label', 'Episode Link').next().clear().type('https://new.episode.link', { delay: 0 })
    })
    cy.contains('Save').click()

    cy.get('.upcoming h3').first().find('span span').trigger('mouseover')
    cy.get('a[title="Search Finder"]').should('have.attr', 'href', 'https://updated.show.link')
    cy.get('a[title="Search New Search"]').should('have.attr', 'href', 'https://new.show.link')
    cy.get('.upcoming h3').first().find('span span').trigger('mouseout')

    cy.get('.upcoming .episode-number span').first().trigger('mouseover')
    cy.get('a[title="Search Finder"]').should('have.attr', 'href', 'https://updated.episode.link')
    cy.get('a[title="Search New Search"]').should('have.attr', 'href', 'https://new.episode.link')
  })

  it('sends the settings on save', () => {
    // ensure settings are reset to their original values
    cy.load()
    cy.get('[title="Settings"]').click()

    cy.interceptApi('PUT', 'user', { statusCode: 204 }).as('updateUser')

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
