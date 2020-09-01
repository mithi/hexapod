# Contributing

Thank you for your interest in contributing to this project! All types of contributions are welcome, no matter how big or small. 

I highly encourage that you read this guide before submitting a PR. It won't take you more than five minutes to read! 

These are mostly guidelines, not rules. Use your best judgment.

## ❤️ The most important ones

- Please [allow project maintainers to edit your pull request][how_to_allow_pr_edits_link]!

- Consistent code formatting is important. I use automatic code formatters ([prettier][prettier_link] for Javascript, [black][black_link] for Python).

- I use [code climate][code_climate_link] to detect code smells. I really appreciate code that is written with readability in mind. I always think about how I can reduce cognitive complexity of my code before committing them.

- I try to adhere to this [commit style guide][commit_style_guide_link] when I word my commit messages.

- Each commit **MUST** sucessfully build, not just the last one! That way, we can checkout any commit and be confident that the app works at that point in time! Your PR will most likely NOT be merged if the CI build fails.

- I prefer PRs with commits with fewer changes, so it's easier to code review. If the commit is easy to understand, the more confident I would be to merge it. All the changes in a single commit must be logically connected!

- Of course, don't get too crazy with extremely small commits! That would just pollute the commit history. [Squash the commits and push force][rewriting_git_history_link] if you need to. 

- If somebody else's changes were merged to the main repo before your pull request is approved. Please do NOT merge. Please REBASE instead! [Merging vs Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing). It keeps the history tidy! `git pull --rebase`

- I like it when people are nice to each other. I don't like mean or rude people. [![Contributor Covenant][contributor_covenant_badge]](./CODE_OF_CONDUCT.md)

## ❤️ Nice to have

- Before contributing, it's probably better to discuss the change you wish to make in an issue first. An issue explaining what you want to accomplish, why you want to do it, and how would do it.

- Thoughtfully-written explanations and the rationale of the pull request is always appreciated!

- Explanations of issues and PRs don't have to be long. Two or three sentences might be sufficient in a lot of cases, probably.

- Including corresponding tests in your PR is always appreciated.

- For whatever purpose it may serve, here's [a simple git workflow][git_workflow_link] I try to stick to.


## ❤️ A few examples of things you can do

- Work on an existing issue (feature request, bug, etc)
- Add new tests and test cases to improve code coverage
- Work on optimizations, performance, speed, efficiency improvements
- Report and fix bugs
- Suggest idiomatic code and better software practices
- Suggest ways to improving code quality / readability
- Suggest additional refactors to reduce cognitive complexity or what not
- Improve user interface / experience and design
- Improve documentation and code comments
- Your own cool idea! Feature requests. Suggest an idea for this project.
- None of the above

## ❤️ Thank you for reading! 🤗

[contributor_covenant_badge]: https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg

[contibutor_covenant_link]: https://www.contributor-covenant.org/

[contribute_link]: https://github.com/mithi/hexapod/wiki/Types-of-(code)-Contributions

[commit_style_guide_link]: https://github.com/mithi/hexapod/wiki/A-Commit-Style-Guide

[git_workflow_link]: https://github.com/mithi/hexapod/wiki/Simple-Git-Workflow-guide

[prettier_link]: https://prettier.io/

[black_link]: https://github.com/psf/black

[code_climate_link]: https://github.com/mithi/hexapod/blob/master/.codeclimate.yml

[rewriting_git_history_link]: https://thoughtbot.com/blog/git-interactive-rebase-squash-amend-rewriting-history

[how_to_allow_pr_edits_link]: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork
