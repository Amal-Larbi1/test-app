describe('Todo App End-to-End Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
  });

  it('Login with invalid credentials', () => {
    cy.get('input[name=email]').clear().type('wrong@example.com');
    cy.get('input[name=password]').clear().type('wrongpassword');
    cy.get('button[type=submit]').click();

    cy.contains('Email ou mot de passe incorrect', { timeout: 6000 }).should('exist');
    cy.url().should('not.include', '/todo');
  });

  it('Login with valid credentials and add/edit/delete a todo', () => {

    cy.get('input[name=email]').clear().type('test@example.com');
    cy.get('input[name=password]').clear().type('password');
    cy.get('button[type=submit]').click();
    cy.url({ timeout: 8000 }).should('include', '/todo');
    cy.get('input[name=newTask]', { timeout: 6000 }).should('exist').clear().type('Nouvelle tâche');
    cy.get('[data-cy=add-task]').click();
    cy.contains('Nouvelle tâche', { timeout: 6000 }).should('exist');
    cy.get('[data-cy=edit-task]', { timeout: 6000 }).first().click();
    cy.get('[data-cy=edit-task-input]').clear().type('Tâche modifiée');
    cy.get('[data-cy=save-task]').click();
    cy.contains('Tâche modifiée').should('exist');
    cy.get('[data-cy=delete-task]', { timeout: 6000 }).first().click();
    cy.contains('Tâche modifiée').should('not.exist');
  });
});