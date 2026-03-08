describe('Zenith Task Landing Page', () => {
  it('should load the landing page and display the title', () => {
    cy.visit('/');
    cy.contains('ZENITH').should('be.visible');
    cy.contains('Get Started with Google').should('be.visible');
  });

  it('should have the correct background gradients', () => {
    cy.visit('/');
    cy.get('.fixed.inset-0.z-0').should('exist');
  });
});
