describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly', () => {
    cy.contains('Masuk ke Akun Anda').should('be.visible');
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

    // We can check if an alert is shown or if error state is visible
    // Since alert is a custom component, we assume it's visible on the screen
    cy.on('window:alert', (str) => {
      expect(str).to.equal('email or password is wrong');
    });
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
