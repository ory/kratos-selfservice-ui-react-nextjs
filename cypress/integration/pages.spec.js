context("Ory Kratos pages", () => {
  beforeEach(() => {
    cy.clearCookies({ domain: null })
  })

  it("can load the login page", () => {
    cy.visit("/login")
    cy.get('[name="method"]').should("exist")
  })

  it("can load the registration page", () => {
    cy.visit("/registration")
    cy.get('[name="traits.email"]').should("exist")
    cy.get('[name="method"]').should("exist")
  })

  it("can load the verification page", () => {
    cy.visit("/verification")
    cy.get('[name="method"]').should("exist")
  })

  it("can load the recovery page", () => {
    cy.visit("/recovery")
    cy.get('[name="method"]').should("exist")
  })

  it("can load the welcome page", () => {
    cy.visit("/")
    cy.get("h2").should("exist")
  })
})
