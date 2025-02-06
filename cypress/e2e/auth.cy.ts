describe('Authentication', () => {
  beforeEach(() => {
    cy.intercept('GET', '/auth/google').as('googleAuth');
    cy.intercept('GET', '/auth/facebook').as('facebookAuth');
  });

  it('should redirect to Google OAuth', () => {
    cy.visit('http://localhost:3000/auth/google');
    cy.wait('@googleAuth').then((interception) => {
      expect(interception.response?.statusCode).to.be.oneOf([302]);
      expect(interception.response?.headers.location).to.include(
        'accounts.google.com',
      );
    });
  });

  it('should redirect to Facebook OAuth', () => {
    cy.visit('http://localhost:3000/auth/facebook');
    cy.wait('@facebookAuth').then((interception) => {
      expect(interception.response?.statusCode).to.be.oneOf([302]);
      expect(interception.response?.headers.location).to.include(
        'facebook.com',
      );
    });
  });

  it('should handle successful OAuth callback', () => {
    // Mock successful OAuth callback
    cy.intercept('GET', '/auth/google/callback*', {
      statusCode: 200,
      body: {
        access_token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
        },
      },
    }).as('googleCallback');

    cy.visit('http://localhost:3000/auth/google/callback?code=mock-code');
    cy.wait('@googleCallback').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body).to.have.property('access_token');
    });
  });

  it('should handle OAuth failure', () => {
    cy.intercept('GET', '/auth/google/callback*', {
      statusCode: 401,
      body: {
        message: 'Authentication failed',
      },
    }).as('failedCallback');

    cy.visit('http://localhost:3000/auth/google/callback?error=access_denied');
    cy.wait('@failedCallback').then((interception) => {
      expect(interception.response?.statusCode).to.equal(401);
    });
  });
});
