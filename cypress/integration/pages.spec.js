const randomString = () => (Math.random() + 1).toString(36).substring(7)
const randomPassword = () => randomString() + randomString()
const randomEmail = () => randomString() + "@" + randomString() + ".com"

context("Ory Kratos pages", () => {
  const email = randomEmail()
  const password = randomPassword()

  beforeEach(() => {
    cy.clearCookies({ domain: null })
  })

  it("can load the login page", () => {
    cy.visit("/login")
    cy.get('[name="method"]').should("exist")
  })

  it("can load the registration page", () => {
    cy.visit("/registration")
    cy.get('[name="traits.email"]').type(email)
    cy.get('[name="password"]').type(password)
    cy.get('[name="method"]').click()
    cy.location("pathname").should("eq", "/")
    cy.get('[data-testid="logout"]').should(
      "have.attr",
      "aria-disabled",
      "false",
    )
    cy.get('[data-testid="session-content"]').should("contain.text", email)
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
