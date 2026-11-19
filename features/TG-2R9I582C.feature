@larryg
Feature: Navigation allows access to Home, About, Contact, or KlassiTech pages

  Background:
    Given a visitor opens the website

  @BR-001 @AT-001 @TC-001
  Scenario Outline: Visitor selects a navigation link from the menu
    When the visitor selects the "<navigation_link>" navigation link
    Then the "<heading>" heading is displayed
    Examples:
      | navigation_link | heading |
      | Home | Welcome to the Klassi™ Brand |
      | About | About Us |
      | Contact | Contact Us |
      | KlassiTech | KlassiTech |

