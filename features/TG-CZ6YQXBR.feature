Feature: The About page must display sections with their content

  Background:
    Given a visitor opens the website

  @BR-003 @AT-003 @TC-003
  Scenario: The About page successfully displays the About Us section with its content
    Then the About Us section is displayed

  @BR-004 @AT-004 @TC-004
  Scenario: The About page successfully displays the Our Mission section with its content
    Then the Our Mission section is displayed

  @BR-005 @AT-005 @TC-005
  Scenario: The About page successfully displays the Our Vision section with its content
    Then the Our Vision section is displayed
