describe('index', () => {
  before(() => {
    cy.load()
  })

  it('displays recent, upcoming, and off air shows', () => {
    cy.get('.recent').within(() => {
      cy.get('h2').invoke('text').should('equal', 'Recent')
      cy.get('h3').text()
      .should('deep.equal', [
        'House of the Dragon',
        'Rings of Power',
      ])
    })

    cy.get('.upcoming').within(() => {
      cy.get('h2').invoke('text').should('equal', 'Upcoming')
      cy.get('h3').text()
      .should('deep.equal', [
        'Avenue 5',
        'Rings of Power',
        'House of the Dragon',
        '1899',
      ])
    })

    cy.get('.off-air').within(() => {
      cy.get('h2').invoke('text').should('equal', 'Off Air')
      cy.get('h3').text()
      .should('deep.equal', [
        'His Dark Materials',
        'Severance',
        'The Rehearsal',
      ])
    })
  })

  it('displays recent and upcoming episodes', () => {
    cy.get('.recent .episode-single .title').text()
    .should('deep.equal', [
      'The Lord of the Tides',
      'The Eye',
    ])

    cy.get('.upcoming.episode-single .title').text()
    .should('deep.equal', [
      'No One Wants an Argument About Reality',
      'What an Unseasonal Delight',
      'Is It a Good Dot?',
      'Alloyed',
      'The Green Council',
      'The Black Queen',
      'The Yellow Bird',
      'Das Schiff',
      'Der Junge',
      'Der Nebel',
    ])
  })

  it('highlights episodes from yesterday and today', () => {
    cy.get('.yesterday .title').text().should('equal', 'The Lord of the Tides')
    cy.get('.today .title').text().should('equal', 'No One Wants an Argument About Reality')
  })

  it('shows "more" button if more than 3 episodes and does not if less than or equal to 3 episodes', () => {
    cy.contains('Avenue 5').closest('li').find('.more-less')
    cy.contains('House of the Dragon').closest('li').find('.more-less').should('not.exist')
  })

  it('shows all episodes and changes button text after clicking "more"', () => {
    cy.contains('Avenue 5').closest('li').find('.more-less a').click()
    cy.contains('Avenue 5').closest('li').find('.more-less a').text().should('equal', 'less')
    cy.contains('Avenue 5').closest('li').find('.upcoming.episode-single .title').text()
    .should('deep.equal', [
      'No One Wants an Argument About Reality',
      'What an Unseasonal Delight',
      'Is It a Good Dot?',
      'How It Ends: As a Starter and a Main',
      'Let\'s Play with Matches',
      'Intoxicating Clarity',
      'I Love Judging People',
      'That\'s Why They Call It a Missile',
    ])
  })
})
