# gherklin-disable
@release @a11y
Feature: Accessibility validation using klassijs-a11y-validator
  As a QA engineer
  I want to run accessibility checks in automated tests
  So that accessibility issues are identified early

  @url
  Scenario Outline: Validate accessibility by crawling the whole site from a URL
    Given they run the accessibility validator command <startUrl>
    When the accessibility crawl results should be generated
    Examples:
      | startUrl                                            |
      | https://www.oxfordmusiconline.com/grovemusic        |
      | https://www.oup.com                                 |
      | https://app.mymathsdev.co.uk/myportal/library/9/247 |
      | https://ktestgenie.com                              |
      | https://www.oxfordartonline.com/groveart            |

  @pages
  Scenario Outline: Validate accessibility for a fixed list of URLs (no crawl)
    Given they run the accessibility validator on page <pageUrl>

    Examples:
      | pageUrl                                             |
      | https://www.oxfordmusiconline.com/grovemusic        |
      | https://ktestgenie.com                              |
      | https://www.oup.com                                 |
      | https://www.oxfordmusiconline.com/grovemusic/browse |
      | https://www.oxfordartonline.com/groveart            |
      | https://app.mymathsdev.co.uk/myportal/library/9/247 |

  @csv @integration
  Scenario: Validate accessibility for URLs loaded from a CSV file (no crawl)
    Given they run the accessibility validator on pages from csv file "data/a11y-pages.csv"

  @urlauth @regression
  Scenario Outline: Validate accessibility by crawling the whole site from a URL (login once)
    Given they run the accessibility validator command with auth <startUrl>
    When the accessibility crawl results should be generated
    Examples:
      | startUrl               |
      | https://ktestgenie.com |
      | https://ktestgenie.com |

  @csvauth @regression
  Scenario: Validate accessibility for a mix of public/private URLs loaded from a CSV file (login once)
    Given they run the accessibility validator on pages from csv file with auth "data/a11y-pages.csv"

  @both
  Scenario Outline: Validate accessibility by crawling public then validating one private page (login once)
    Given they run the accessibility validator by crawling public from <siteUrl> then validating private page <siteUrl>
    When the accessibility crawl results should be generated
    Examples:
      | siteUrl                |
      | https://ktestgenie.com |
      | https://ktestgenie.com |
