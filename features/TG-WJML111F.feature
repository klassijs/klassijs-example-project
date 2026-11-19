@larryg
Feature: Selecting the email contact link invokes a mailto action addressed to info@klassi.co.uk

  Background:
    Given a visitor opens the website

  @BR-001 @AT-001 @TC-001
  Scenario: Visitor selects the email contact link successfully invokes mailto action
    Then the info@klassi.co.uk is displayed
    When the visitor activates the email contact link
    Then it invokes a mailto action addressed to info@klassi.co.uk

  @BR-002 @AT-002 @TC-002
  Scenario: Visitor attempts to select a non-existent email contact link
    When the email contact link is not displayed
    Then no mailto action is invoked

  @BR-003 @AT-003 @TC-003
  Scenario: Visitor selects the email contact link when disabled
    Then the info@klassi.co.uk is displayed
    And no mailto action is invoked
