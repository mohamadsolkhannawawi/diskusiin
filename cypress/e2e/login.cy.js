describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly', () => {
    cy.contains('Selamat datang kembali').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button').contains('Masuk').should('be.visible');
  });

  it('should display error message when login failed', () => {
    // Intercept the API login request and force it to fail
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginRequest');

    cy.get('input[type="email"]').type('wrong@test.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginRequest');

    // Verify that the custom alert toast shows the error message
    cy.get('.alert-toast').should('be.visible').and('contain', 'email or password is wrong');
  });

  it('should redirect to home page and show user info when login success', () => {
    // Mock the API requests
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          token: 'fake-token',
        },
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Test+User',
          },
        },
      },
    }).as('getProfileRequest');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginRequest');
    cy.wait('@getProfileRequest');

    // Check if we are redirected to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
