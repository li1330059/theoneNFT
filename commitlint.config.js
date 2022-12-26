module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', [
        'feat', 'fix', 'bugfix', 'hotfix', 'revert', 'docs', 'static', 'style', 'perf', 'test', 'chore', 'refactor'
      ]],
      'subject-full-stop': [0, 'never'],
      'subject-case': [0, 'never']
    }
  }