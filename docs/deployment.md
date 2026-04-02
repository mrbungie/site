# Deployment Guide

This document explains how to deploy the Astro website to Cloudflare Pages automatically using GitHub Actions.

## Overview

We use continuous integration and delivery (CI/CD) natively through GitHub Actions. Every push to the `main` or `master` branch will trigger a workflow that builds the Astro site and deploys the generated `dist/` folder directly to Cloudflare Pages. 

## Configuration Requirements

To enable successful automated deployments, you must configure the following **Secrets** and **Variables** in your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`). All environment-specific settings are injected at runtime by the GitHub Action.

### Repository Secrets
Secrets are encrypted and will not appear in the logs.

- `CLOUDFLARE_API_TOKEN`: A Cloudflare API token with explicit permissions to edit Cloudflare Pages projects.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on the right sidebar of the Cloudflare dashboard).

### Repository Variables
Variables are accessible in plaintext and are used for environment configuration.

- `CLOUDFLARE_PROJECT_NAME`: The target project name in Cloudflare Pages where you want to deploy the application.

## Deployment Workflow Summary

The deployment workflow is defined in the repository at `.github/workflows/deploy.yml`. When triggered, it performs the following steps:
1. Checks out the repository source code.
2. Sets up the specified version of Node.js (`v22`).
3. Clean-installs dependencies via `npm ci`.
4. Builds the Astro project for production using `npm run build`.
5. Deploys the resulting `dist` output folder to Cloudflare Pages utilizing the `cloudflare/pages-action` package and the secrets/variables provided above.

## Manual Deployments

While GitHub Actions are the preferred method, if an emergency requires a manual deployment from your local machine, use the official Cloudflare Wrangler CLI:

```bash
# 1. Install Wrangler globally
npm install -g wrangler

# 2. Build the production site locally
npm run build

# 3. Deploy the resulting application
npx wrangler pages deploy dist --project-name <your-project-name>
```
