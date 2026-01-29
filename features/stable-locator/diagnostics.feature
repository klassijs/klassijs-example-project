@diagnostics
Feature: Stable locator diagnostics
  Scenario: Print diagnostics for login submit
    When I navigate to the login page
    Then I print locator diagnostics for the login button
