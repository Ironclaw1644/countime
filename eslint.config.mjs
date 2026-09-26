import next from 'eslint-config-next';

const config = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', '.claude/**', '.revamp-*/**'],
  },
];

export default config;
