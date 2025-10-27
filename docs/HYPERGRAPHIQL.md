# HyperGraphiQL System

## Quick Start

To deploy and test the HyperGraphiQL interface:

1. **Verify Deployment**: The interface is deployed automatically via Netlify on push to main
2. **Access the Interface**: Navigate to `/hypergraph` in your deployed application
3. **Run Tests**: Tests run automatically in GitHub Actions, or run locally with:
   ```bash
   export GITHUB_TOKEN=your_token_here  # optional but recommended
   deno test -A hypergraph_test.ts
   ```

## Overview

The HyperGraphiQL system is an interactive visualization tool for exploring all repositories in the cogpy GitHub organization. It dynamically fetches repository data from the GitHub API and presents it in multiple views:

- **Graph View**: Visual network diagram showing repositories clustered by programming language
- **List View**: Comprehensive list of all repositories with details

## Features

- 🔄 Dynamic repository fetching from GitHub API
- 📊 Multiple visualization modes (Graph & List views)
- 🎨 Language-based filtering and clustering
- 🔍 Repository search and discovery
- 💾 Fallback to cached data if API is unavailable
- 🌐 Support for public and private repositories (with authentication)

## Configuration

### GitHub Token (Optional but Recommended)

For better rate limits and access to private repositories, configure a GitHub Personal Access Token:

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - **Recommended**: Use "Fine-grained tokens" for better security
     - Click "Generate new token" under Fine-grained tokens
     - Give it a descriptive name (e.g., "PLAN HyperGraphiQL")
     - Select "Resource owner" as your organization (cogpy)
     - Set "Repository access" to "All repositories" or select specific ones
     - Under "Permissions", set:
       - Repository permissions → Contents: Read
       - Repository permissions → Metadata: Read
     - Click "Generate token" and copy the token
   - **Alternative**: Use "Tokens (classic)" (legacy)
     - Click "Generate new token (classic)"
     - Give it a descriptive name
     - Select scopes: `repo` (for private repositories) and `read:org` (for organization data)
     - Click "Generate token" and copy the token

2. **Set the token in your environment**:
   
   For local development, add to your Convex environment:
   ```bash
   npx convex env set GITHUB_TOKEN your_github_token_here
   ```

   For CI/CD (GitHub Actions), add as a repository secret:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add a new secret named `GITHUB_TOKEN`
   - Paste your token value

### Rate Limits

Without authentication:
- 60 requests per hour per IP address

With authentication (Personal Access Token - Classic):
- 5,000 requests per hour

With fine-grained tokens:
- Typically 5,000 requests per hour (may vary based on token permissions and repository owner's plan)

The HyperGraphiQL system uses pagination and typically makes 1-2 requests to fetch all repositories (fewer than 200 repos) or up to 20 requests for very large organizations.

## Usage

### Accessing the HyperGraphiQL Page

Navigate to `/hypergraph` in the application to view the visualization.

### Deployment

The HyperGraphiQL interface is deployed automatically with the main application:

1. **Netlify Deployment** (Automatic):
   - Configured in `netlify.toml`
   - Deploys on push to main branch
   - Build command: `npx convex deploy --cmd 'npm run build'`
   - The `/hypergraph` route is accessible after deployment

2. **Local Development**:
   ```bash
   npm install
   npm run dev
   ```
   Then visit `http://localhost:5173/hypergraph`

3. **Manual Build**:
   ```bash
   npm run build
   npm run preview
   ```

### API Integration

The system provides two integration methods:

1. **Frontend Direct Fetch** (Default):
   - Located in `src/utils/github-api.ts`
   - Fetches directly from GitHub API in the browser
   - Uses the public API by default

2. **Convex Backend Action** (Alternative):
   - Located in `convex/github.ts`
   - Server-side fetching with better security for tokens
   - Can be enabled by updating the frontend to use Convex actions

## Testing

The HyperGraphiQL system includes comprehensive Deno tests that verify GitHub API integration and repository fetching.

### Running Tests Locally

To run tests with authentication (recommended for full functionality):

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Run all tests with all permissions (quick for development)
deno test -A hypergraph_test.ts

# With specific permissions (recommended for production)
deno test --allow-net --allow-env hypergraph_test.ts
```

To run tests without authentication (limited by rate limits):

```bash
# Tests will use public API (60 requests/hour)
deno test -A hypergraph_test.ts
```

### CI/CD Testing

Tests run automatically in GitHub Actions on every push and pull request. The workflow is configured in `.github/workflows/deno.yml` and automatically uses GitHub's built-in authentication token, so no manual configuration is needed.

The test suite verifies:
- ✅ Successful fetching of cogpy organization repositories
- ✅ Repository data structure completeness
- ✅ Presence of important repositories
- ✅ Repository count (should be 100+)

## Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (hypergraph.tsx)              │
│  - React component                      │
│  - State management                     │
│  - Visualization rendering              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  GitHub API Client (github-api.ts)      │
│  - Fetch repositories                   │
│  - Handle pagination                    │
│  - Error handling                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  GitHub REST API v3                     │
│  GET /orgs/cogpy/repos                  │
│  - Public & private repositories        │
│  - Pagination support (100/page)        │
└─────────────────────────────────────────┘
```

## Troubleshooting

### "API rate limit exceeded" error

If you encounter rate limit errors:
1. Set up a GitHub Personal Access Token (see Configuration above)
2. Wait for the rate limit to reset (check response headers)
3. The system will fall back to cached data automatically

### Missing private repositories

Private repositories require authentication:
1. Ensure `GITHUB_TOKEN` is set with appropriate scopes
2. The token must have `repo` and `read:org` permissions
3. Verify the token is valid and not expired

### Slow loading

The initial fetch may take 5-10 seconds for organizations with many repositories:
- This is normal for 100+ repositories
- Data is refetched on each page load (no persistent caching)
- Consider implementing server-side caching with Convex tables for production to improve performance

## Contributing

To add new features to the HyperGraphiQL system:

1. Update the `Repository` interface in `src/utils/github-api.ts` if adding new fields
2. Modify the visualization components in `src/routes/hypergraph.tsx`
3. Add corresponding tests in `hypergraph_test.ts`
4. Update this documentation

## Related Files

- `src/routes/hypergraph.tsx` - Main component
- `src/utils/github-api.ts` - GitHub API client
- `convex/github.ts` - Convex backend action (alternative)
- `convex/env.ts` - Environment variable exports
- `hypergraph_test.ts` - Deno test suite
