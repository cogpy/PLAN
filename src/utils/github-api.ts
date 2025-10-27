/**
 * GitHub API client for fetching organization repositories
 * This runs on the client side and uses the public GitHub API
 */

export interface Repository {
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
 * Uses the public GitHub API with optional authentication
 */
export async function fetchOrgRepositories(
  org: string,
  token?: string
): Promise<Repository[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "PLAN-HyperGraphiQL",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const repositories: Repository[] = [];
  let page = 1;
  const perPage = 100; // GitHub API max per page
  let hasMore = true;

  try {
    while (hasMore) {
      const url = `https://api.github.com/orgs/${org}/repos?page=${page}&per_page=${perPage}&type=all`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const error = await response.text();
        
        // Handle rate limiting specifically
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining");
          const rateLimitReset = response.headers.get("X-RateLimit-Reset");
          
          if (rateLimitRemaining === "0" && rateLimitReset) {
            const resetDate = new Date(parseInt(rateLimitReset) * 1000);
            throw new Error(
              `GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}. ` +
              `Consider setting a GITHUB_TOKEN for higher rate limits.`
            );
          }
        }
        
        throw new Error(`GitHub API error (${response.status}): ${error}`);
      }

      const repos = await response.json();

      if (!Array.isArray(repos)) {
        throw new Error("Unexpected response format from GitHub API");
      }

      // Map GitHub API response to our Repository interface
      for (const repo of repos) {
        repositories.push({
          name: repo.name || "",
          url: repo.html_url || "",
          language: repo.language || "",
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          visibility: repo.visibility && typeof repo.visibility === "string"
            ? repo.visibility.charAt(0).toUpperCase() + repo.visibility.slice(1)
            : "Public",
          description: repo.description || undefined,
        });
      }

      // Check if there are more pages
      hasMore = repos.length === perPage;
      page++;

      // Safety check to prevent infinite loops
      if (page > 20) {
        console.warn("Reached maximum page limit (20 pages, 2000 repos)");
        break;
      }
    }

    console.log(`Fetched ${repositories.length} repositories from ${org}`);
    return repositories;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}
