describe('app root', () => {
  it('renders the employee data grid', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.data-grid').should('exist')
  })
})