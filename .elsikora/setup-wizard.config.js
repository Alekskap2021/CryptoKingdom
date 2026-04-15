export default {
  'branch-lint': {
    isEnabled: true
  },
  ci: {
    isEnabled: false
  },
  commitlint: {
    isEnabled: true
  },
  eslint: {
    isEnabled: true,
    features: [
      'sonar',
      'perfectionist',
      'javascript',
      'typescript',
      'jsx',
      'json',
      'yaml',
      'packageJson',
      'markdown',
      'react',
      'tanstack',
      'node',
      'tailwindCss',
      'prettier',
      'fsd'
    ]
  },
  gitignore: {
    isEnabled: true
  },
  ide: {
    isEnabled: true,
    ides: [
      'intellij-idea'
    ]
  },
  license: {
    isEnabled: false
  },
  'lint-staged': {
    isEnabled: true,
    features: [
      'eslint',
      'prettier'
    ]
  },
  prettier: {
    isEnabled: true
  },
  'semantic-release': {
    isEnabled: true,
    repositoryUrl: 'https://github.com/Alekskap2021/CryptoKingdom',
    mainBranch: 'main',
    isPrereleaseEnabled: true,
    preReleaseBranch: 'dev',
    preReleaseChannel: 'beta',
    isBackmergeEnabled: true,
    developBranch: 'dev'
  },
  stylelint: {
    isEnabled: false
  }
};