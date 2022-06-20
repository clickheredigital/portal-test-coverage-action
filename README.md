# CHD Portal Test Coverage Action

This action is intended for CHD Portal project where we have several microservices that are tested individually. It creates a test coverage report for each microservice and comments as a single comment on the pull request.

Please note this action also runs tests in the services that have file changes. The list of services are hardcoded in the action.

## Usage

Make sure to include node/npm in your action/runner.

```yml
- name: Run Tests
  uses: clickheredigital/portal-test-coverage-action@main
  with:
    coverage: ${{ github.event_name == 'pull_request' }}
```

## Development & Deployment

Install the dependencies

```bash
npm install
```

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

# Release branch
Since this action is intended for internal usage there is no release branch.
