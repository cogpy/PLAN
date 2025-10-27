/**
 * Test suite for the HyperGraphiQL system
 * This tests the GitHub API integration and ensures we can fetch all cogpy org repositories
 */

import { assertEquals, assertExists, assert } from "https://deno.land/std@0.208.0/assert/mod.ts";

interface Repository {
  name: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  visibility: string;
  description?: string;
}

/**
 * Fetch all repositories from a GitHub organization
 */
async function fetchOrgRepositories(org: string, token?: string): Promise<Repository[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "PLAN-HyperGraphiQL-Test",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const repositories: Repository[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/orgs/${org}/repos?page=${page}&per_page=${perPage}&type=all`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${error}`);
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      throw new Error("Unexpected response format from GitHub API");
    }

    for (const repo of repos) {
      repositories.push({
        name: repo.name || "",
        url: repo.html_url || "",
        language: repo.language || "",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        visibility: repo.visibility
          ? repo.visibility.charAt(0).toUpperCase() + repo.visibility.slice(1)
          : "Public",
        description: repo.description || undefined,
      });
    }

    hasMore = repos.length === perPage;
    page++;

    if (page > 20) {
      console.warn("Reached maximum page limit (20 pages, 2000 repos)");
      break;
    }
  }

  return repositories;
}

Deno.test("HyperGraphiQL - Fetch cogpy organization repositories", async () => {
  const token = Deno.env.get("GITHUB_TOKEN");
  
  if (!token) {
    console.log("Note: GITHUB_TOKEN not set, using public API (rate limited)");
  }

  const repositories = await fetchOrgRepositories("cogpy", token);

  // Verify we got repositories
  assertExists(repositories, "Should return repositories array");
  assert(repositories.length > 0, "Should fetch at least one repository");
  
  console.log(`✓ Fetched ${repositories.length} repositories from cogpy organization`);

  // Verify repository structure
  const firstRepo = repositories[0];
  assertExists(firstRepo.name, "Repository should have a name");
  assertExists(firstRepo.url, "Repository should have a URL");
  assert(firstRepo.url.includes("github.com/cogpy/"), "URL should be from cogpy organization");
  
  // Check that we have some expected repositories
  const repoNames = repositories.map(r => r.name);
  assert(repoNames.includes("PLAN"), "Should include the PLAN repository");
  
  console.log(`✓ Repository data structure is valid`);
  console.log(`✓ Found expected repositories including PLAN`);
});

Deno.test("HyperGraphiQL - Repository data completeness", async () => {
  const token = Deno.env.get("GITHUB_TOKEN");
  const repositories = await fetchOrgRepositories("cogpy", token);

  // Check data completeness
  for (const repo of repositories) {
    assertExists(repo.name, `Repository should have name: ${JSON.stringify(repo)}`);
    assertExists(repo.url, `Repository ${repo.name} should have URL`);
    assertExists(repo.visibility, `Repository ${repo.name} should have visibility`);
    
    // Verify visibility values are valid
    assert(
      ["Public", "Private", "Internal"].includes(repo.visibility),
      `Repository ${repo.name} visibility should be Public, Private, or Internal, got: ${repo.visibility}`
    );
  }

  console.log(`✓ All ${repositories.length} repositories have complete data`);
});

Deno.test("HyperGraphiQL - Check for specific important repositories", async () => {
  const token = Deno.env.get("GITHUB_TOKEN");
  const repositories = await fetchOrgRepositories("cogpy", token);
  
  const repoNames = new Set(repositories.map(r => r.name));

  // Check for some important repositories from the hardcoded list
  const importantRepos = [
    "PLAN",
    "hypergraphiql",
    "cogflu",
  ];

  for (const repoName of importantRepos) {
    assert(
      repoNames.has(repoName),
      `Should find repository: ${repoName}`
    );
  }

  console.log(`✓ Found all important repositories: ${importantRepos.join(", ")}`);
});

Deno.test("HyperGraphiQL - Repository count check", async () => {
  const token = Deno.env.get("GITHUB_TOKEN");
  const repositories = await fetchOrgRepositories("cogpy", token);
  
  // We know there should be at least 100+ repositories in the cogpy org
  assert(
    repositories.length >= 100,
    `Expected at least 100 repositories, got ${repositories.length}`
  );

  console.log(`✓ Repository count check passed: ${repositories.length} repositories`);
});
