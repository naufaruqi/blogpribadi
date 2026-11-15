// @ts-check
import { defineConfig } from 'astro/config';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base =
  process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}` : '/';

export default defineConfig({ base });
