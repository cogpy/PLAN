import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../ui/logo";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/ui/button-util";
import { ThemeSwitcherHome } from "@/ui/theme-switcher";
import { useState, useMemo, useEffect } from "react";
import { fetchOrgRepositories } from "@/utils/github-api";
import type { Repository } from "@/utils/github-api";

export const Route = createFileRoute("/hypergraph")({
  component: Hypergraph,
});

// Fallback repository data for when API is unavailable
const fallbackRepositories: Repository[] = [
  { name: "cogflu", url: "https://github.com/cogpy/cogflu", language: "Java", stars: 0, forks: 0, visibility: "Public" },
  { name: ".github", url: "https://github.com/cogpy/.github", language: "", stars: 0, forks: 0, visibility: "Public", description: "Special profile readme repository" },
  { name: "mermaidcog", url: "https://github.com/cogpy/mermaidcog", language: "TypeScript", stars: 0, forks: 8200, visibility: "Public", description: "Generation of diagrams like flowcharts or sequence diagrams from text" },
  { name: "cray", url: "https://github.com/cogpy/cray", language: "Python", stars: 0, forks: 6800, visibility: "Public", description: "Cog Ray is an AI compute engine" },
  { name: "rayc", url: "https://github.com/cogpy/rayc", language: "Python", stars: 0, forks: 6800, visibility: "Public", description: "RayCog is an AI compute engine" },
  { name: "cogmodel-catalog", url: "https://github.com/cogpy/cogmodel-catalog", language: "Python", stars: 0, forks: 2, visibility: "Public" },
  { name: "regilama", url: "https://github.com/cogpy/regilama", language: "PHP", stars: 0, forks: 93, visibility: "Public" },
  { name: "unopim", url: "https://github.com/cogpy/unopim", language: "PHP", stars: 0, forks: 93, visibility: "Public", description: "Laravel-based Product Information Management (PIM) system" },
  { name: "chainlex", url: "https://github.com/cogpy/chainlex", language: "Cypher", stars: 0, forks: 1, visibility: "Public" },
  { name: "selfplay-arena", url: "https://github.com/cogpy/selfplay-arena", language: "Python", stars: 0, forks: 1, visibility: "Public" },
  { name: "coginlex", url: "https://github.com/cogpy/coginlex", language: "Cypher", stars: 0, forks: 1, visibility: "Public" },
  { name: "cog-echo", url: "https://github.com/cogpy/cog-echo", language: "Scheme", stars: 0, forks: 1, visibility: "Public" },
  { name: "esmetacog", url: "https://github.com/cogpy/esmetacog", language: "Scala", stars: 0, forks: 22, visibility: "Public", description: "ECMAScript Specification (ECMA-262) Meta Cog language" },
  { name: "KogboldAI", url: "https://github.com/cogpy/KogboldAI", language: "C++", stars: 0, forks: 847, visibility: "Public", description: "KogboldAI is generative AI software" },
  { name: "ecma262cog", url: "https://github.com/cogpy/ecma262cog", language: "HTML", stars: 0, forks: 1400, visibility: "Public", description: "Status, process, and documents for ECMA-262 Cog" },
  { name: "CogWSL", url: "https://github.com/cogpy/CogWSL", language: "C++", stars: 0, forks: 1500, visibility: "Public", description: "Cog Windows Subsystem for Linux" },
  { name: "CogBotFramework-Composer", url: "https://github.com/cogpy/CogBotFramework-Composer", language: "TypeScript", stars: 0, forks: 376, visibility: "Public", description: "Dialog creation and management for Microsoft CogBot Framework" },
  { name: "cogbotframework-components", url: "https://github.com/cogpy/cogbotframework-components", language: "C#", stars: 0, forks: 84, visibility: "Public", description: "Components for Azure CogBot Framework" },
  { name: "ocgpt", url: "https://github.com/cogpy/ocgpt", language: "Python", stars: 0, forks: 0, visibility: "Public" },
  { name: "coglux", url: "https://github.com/cogpy/coglux", language: "C", stars: 0, forks: 58000, visibility: "Public", description: "Cog Linux kernel source tree" },
  { name: "CogBotFramework-WebChat", url: "https://github.com/cogpy/CogBotFramework-WebChat", language: "HTML", stars: 0, forks: 1600, visibility: "Public", description: "Web-based client for Azure CogBot Services" },
  { name: "CogBotFramework-Emulator", url: "https://github.com/cogpy/CogBotFramework-Emulator", language: "TypeScript", stars: 0, forks: 772, visibility: "Public", description: "Desktop application for testing chat bots" },
  { name: "cogbotbuilder-tools", url: "https://github.com/cogpy/cogbotbuilder-tools", language: "JavaScript", stars: 0, forks: 262, visibility: "Public", description: "Tools for developers building bots" },
  { name: "cogbotframework-cli", url: "https://github.com/cogpy/cogbotframework-cli", language: "TypeScript", stars: 0, forks: 123, visibility: "Public", description: "CLI Tools for Microsoft CogBot Framework" },
  { name: "CogBotBuilder-Samples", url: "https://github.com/cogpy/CogBotBuilder-Samples", language: "HTML", stars: 0, forks: 4900, visibility: "Public", description: "Bot Framework samples" },
  { name: "cogbotframework", url: "https://github.com/cogpy/cogbotframework", language: "", stars: 0, forks: 86, visibility: "Public" },
  { name: "cogbotframework-sdk", url: "https://github.com/cogpy/cogbotframework-sdk", language: "JavaScript", stars: 0, forks: 2500, visibility: "Public", description: "CogBot Framework SDK" },
  { name: "kokkog", url: "https://github.com/cogpy/kokkog", language: "C++", stars: 0, forks: 472, visibility: "Public", description: "Kokkog C++ Performance Portability Programming" },
  { name: "cogtaskflow", url: "https://github.com/cogpy/cogtaskflow", language: "C++", stars: 0, forks: 1300, visibility: "Public", description: "Task-parallel Programming System" },
  { name: "cogprime", url: "https://github.com/cogpy/cogprime", language: "C", stars: 0, forks: 5, visibility: "Public" },
  { name: "neocogcities", url: "https://github.com/cogpy/neocogcities", language: "CSS", stars: 0, forks: 158, visibility: "Public", description: "Neocogcities.org backend" },
  { name: "cog-ad-res", url: "https://github.com/cogpy/cog-ad-res", language: "JavaScript", stars: 0, forks: 1, visibility: "Public", description: "AD Response" },
  { name: "mastraimul", url: "https://github.com/cogpy/mastraimul", language: "", stars: 0, forks: 0, visibility: "Internal" },
  { name: "cogn8n", url: "https://github.com/cogpy/cogn8n", language: "TypeScript", stars: 0, forks: 48000, visibility: "Public", description: "Fair-code cognitive workflow automation platform" },
  { name: "CogFin-MA", url: "https://github.com/cogpy/CogFin-MA", language: "Jupyter Notebook", stars: 0, forks: 2, visibility: "Public", description: "Cog Retrieval-Augmented Multi-Agent Framework" },
  { name: "mem0cog", url: "https://github.com/cogpy/mem0cog", language: "Python", stars: 0, forks: 4500, visibility: "Public", description: "Universal Cog memory layer for AI Agents" },
  { name: "swarmcog", url: "https://github.com/cogpy/swarmcog", language: "Python", stars: 0, forks: 2200, visibility: "Public", description: "Lightweight multi-agent orchestration" },
  { name: "tinycograd", url: "https://github.com/cogpy/tinycograd", language: "Python", stars: 0, forks: 3700, visibility: "Public", description: "tinycograd" },
  { name: "oc-cs-agents-demo", url: "https://github.com/cogpy/oc-cs-agents-demo", language: "Python", stars: 0, forks: 895, visibility: "Public", description: "Customer service with OpenAI Agents SDK" },
  { name: "cogdex", url: "https://github.com/cogpy/cogdex", language: "Rust", stars: 0, forks: 6000, visibility: "Public", description: "Lightweight cognitive coding agent" },
  { name: "binutils-cogdb", url: "https://github.com/cogpy/binutils-cogdb", language: "C", stars: 0, forks: 631, visibility: "Public", description: "binutils-cogdb" },
  { name: "cogsist-ui", url: "https://github.com/cogpy/cogsist-ui", language: "TypeScript", stars: 0, forks: 763, visibility: "Public", description: "Typescript/React Library for Cog AI Chat" },
  { name: "cog_model_spec", url: "https://github.com/cogpy/cog_model_spec", language: "Python", stars: 0, forks: 80, visibility: "Public", description: "Cog adaptation of OpenAI Model Spec" },
  { name: "cog-gpt-oss", url: "https://github.com/cogpy/cog-gpt-oss", language: "Python", stars: 0, forks: 1900, visibility: "Public", description: "OpenCog implementations of language models" },
  { name: "rwkv-raven-cog", url: "https://github.com/cogpy/rwkv-raven-cog", language: "Python", stars: 0, forks: 0, visibility: "Public" },
  { name: "skycogpilot", url: "https://github.com/cogpy/skycogpilot", language: "Python", stars: 0, forks: 824, visibility: "Public", description: "Run AI workloads on any infrastructure" },
  { name: "casecog", url: "https://github.com/cogpy/casecog", language: "Python", stars: 0, forks: 0, visibility: "Internal" },
  { name: "oc-agents-py", url: "https://github.com/cogpy/oc-agents-py", language: "Python", stars: 0, forks: 2800, visibility: "Public", description: "Lightweight cognitive framework for multi-agent workflows" },
  { name: "cogify-v5", url: "https://github.com/cogpy/cogify-v5", language: "JavaScript", stars: 0, forks: 4, visibility: "Private" },
  { name: "cog253", url: "https://github.com/cogpy/cog253", language: "HTML", stars: 0, forks: 1, visibility: "Public" },
  { name: "oc-agents-js", url: "https://github.com/cogpy/oc-agents-js", language: "TypeScript", stars: 0, forks: 435, visibility: "Public", description: "Cognitive framework for multi-agent workflows" },
  { name: "cogcute_framework", url: "https://github.com/cogpy/cogcute_framework", language: "C", stars: 0, forks: 43, visibility: "Public", description: "Cute framework for 2D games in C++" },
  { name: "hypergraphiql", url: "https://github.com/cogpy/hypergraphiql", language: "TypeScript", stars: 0, forks: 1800, visibility: "Public", description: "HyperGraphiQL & the HyperGraphQL LSP Reference Ecosystem" },
  { name: "auto-orgs", url: "https://github.com/cogpy/auto-orgs", language: "Shell", stars: 0, forks: 2, visibility: "Public", description: "Enabling Fully Autonomous Organizations" },
  { name: "Enterprise-Grade-Agents-Course", url: "https://github.com/cogpy/Enterprise-Grade-Agents-Course", language: "Python", stars: 0, forks: 4, visibility: "Public", description: "Building enterprise agents" },
  { name: "Multi-Agent-Template-App", url: "https://github.com/cogpy/Multi-Agent-Template-App", language: "Shell", stars: 0, forks: 19, visibility: "Public", description: "Multi-agent application template" },
  { name: "SemanticMediaWiki", url: "https://github.com/cogpy/SemanticMediaWiki", language: "PHP", stars: 0, forks: 246, visibility: "Public", description: "Knowledge management platform" },
  { name: "litcogpt", url: "https://github.com/cogpy/litcogpt", language: "Python", stars: 0, forks: 1300, visibility: "Public", description: "20+ high-performance LLMs" },
  { name: "cogflare-temp", url: "https://github.com/cogpy/cogflare-temp", language: "TypeScript", stars: 0, forks: 854, visibility: "Public", description: "Templates for CogFlare Workers" },
  { name: "bolt.cog", url: "https://github.com/cogpy/bolt.cog", language: "TypeScript", stars: 0, forks: 0, visibility: "Public" },
  { name: "aphrodite-cogin", url: "https://github.com/cogpy/aphrodite-cogin", language: "C++", stars: 0, forks: 173, visibility: "Public", description: "Large-scale Cog LLM inference engine" },
  { name: "open-cogent", url: "https://github.com/cogpy/open-cogent", language: "TypeScript", stars: 0, forks: 45, visibility: "Public", description: "Open-source Cog alternative to Claude Agent SDK" },
  { name: "skycog-llama", url: "https://github.com/cogpy/skycog-llama", language: "Python", stars: 0, forks: 7, visibility: "Public" },
  { name: "reservoircog", url: "https://github.com/cogpy/reservoircog", language: "Python", stars: 0, forks: 131, visibility: "Public", description: "Cognitive Reservoir Computing architectures" },
  { name: "milvuscog", url: "https://github.com/cogpy/milvuscog", language: "Go", stars: 0, forks: 3500, visibility: "Public", description: "Cloud-native vector database" },
  { name: "libre-cog", url: "https://github.com/cogpy/libre-cog", language: "Python", stars: 0, forks: 26, visibility: "Public", description: "Free LLM chatbot web UI" },
  { name: "rwkv_ai00_cogserv", url: "https://github.com/cogpy/rwkv_ai00_cogserv", language: "Rust", stars: 0, forks: 69, visibility: "Public", description: "All-in-one RWKV runtime box" },
  { name: "cogweb-rwkv", url: "https://github.com/cogpy/cogweb-rwkv", language: "Rust", stars: 0, forks: 27, visibility: "Public", description: "RWKV in pure WebGPU/Rust" },
  { name: "CogRWKV-Runner", url: "https://github.com/cogpy/CogRWKV-Runner", language: "TypeScript", stars: 0, forks: 577, visibility: "Public", description: "CogRWKV management and startup tool" },
  { name: "hivecog", url: "https://github.com/cogpy/hivecog", language: "C", stars: 0, forks: 53, visibility: "Public", description: "The CIAI HiveCog source" },
  { name: "llama.cog", url: "https://github.com/cogpy/llama.cog", language: "C++", stars: 0, forks: 13000, visibility: "Public", description: "LLM Cog inference in C/C++" },
  { name: "rwkv.cppy", url: "https://github.com/cogpy/rwkv.cppy", language: "Python", stars: 0, forks: 121, visibility: "Public", description: "INT4/INT5/INT8 and FP16 inference for RWKV" },
  { name: "CogRavEngine", url: "https://github.com/cogpy/CogRavEngine", language: "C++", stars: 0, forks: 51, visibility: "Public", description: "Fast C++23 3D Cog game engine" },
  { name: "coglit", url: "https://github.com/cogpy/coglit", language: "Python", stars: 0, forks: 203, visibility: "Public", description: "Open Cog source platform for AI Engineering" },
  { name: "cogpt4all", url: "https://github.com/cogpy/cogpt4all", language: "C++", stars: 0, forks: 8300, visibility: "Public", description: "Run Local LLMs on Any Device" },
  { name: "kogboldcpp", url: "https://github.com/cogpy/kogboldcpp", language: "C++", stars: 0, forks: 13000, visibility: "Public", description: "Run GGUF models with KoboldAI UI" },
  { name: "coggml", url: "https://github.com/cogpy/coggml", language: "C++", stars: 0, forks: 1400, visibility: "Public", description: "Cog Tensor library for machine learning" },
  { name: "CogRWKV", url: "https://github.com/cogpy/CogRWKV", language: "Python", stars: 0, forks: 705, visibility: "Public", description: "CogRWKV is like ChatGPT" },
  { name: "lite.kai.net", url: "https://github.com/cogpy/lite.kai.net", language: "HTML", stars: 0, forks: 0, visibility: "Private" },
  { name: "rwkv.cog", url: "https://github.com/cogpy/rwkv.cog", language: "C++", stars: 0, forks: 121, visibility: "Public", description: "INT4/INT5/INT8 inference for RWKV Cog" },
  { name: "corg", url: "https://github.com/cogpy/corg", language: "Go", stars: 0, forks: 792, visibility: "Public", description: "Meta configuration for Kubernetes" },
  { name: "cpython", url: "https://github.com/cogpy/cpython", language: "Python", stars: 0, forks: 33000, visibility: "Public", description: "The Python programming language" },
  { name: "cogneuralizer", url: "https://github.com/cogpy/cogneuralizer", language: "C++", stars: 0, forks: 2, visibility: "Public", description: "Deep neural network compiler" },
  { name: "test262cog", url: "https://github.com/cogpy/test262cog", language: "JavaScript", stars: 0, forks: 506, visibility: "Public", description: "ECMAScript Conformance Test Cog Suite" },
  { name: "CoggerUI", url: "https://github.com/cogpy/CoggerUI", language: "TypeScript", stars: 0, forks: 140, visibility: "Public", description: "Simple frontend for Cog LLMs" },
  { name: "miacog", url: "https://github.com/cogpy/miacog", language: "Rust", stars: 0, forks: 2, visibility: "Public", description: "Lightweight inference framework" },
  { name: "cog", url: "https://github.com/cogpy/cog", language: "TypeScript", stars: 0, forks: 0, visibility: "Public", description: "core cog" },
  { name: "ConvCogai-UnrealEngine-SDK", url: "https://github.com/cogpy/ConvCogai-UnrealEngine-SDK", language: "C++", stars: 0, forks: 30, visibility: "Public", description: "Unreal Engine plugin for conversational AI" },
  { name: "Convai-UnrealEngine-SDK", url: "https://github.com/cogpy/Convai-UnrealEngine-SDK", language: "C++", stars: 0, forks: 30, visibility: "Public", description: "Unreal Engine plugin for conversational AI" },
  { name: "mlyticase", url: "https://github.com/cogpy/mlyticase", language: "Python", stars: 0, forks: 2, visibility: "Public" },
  { name: "fabric-sdk-cogo", url: "https://github.com/cogpy/fabric-sdk-cogo", language: "Go", stars: 0, forks: 4, visibility: "Public", description: "Microsoft Fabric SDK for CoGoLang" },
  { name: "swarms-cloud", url: "https://github.com/cogpy/swarms-cloud", language: "Python", stars: 0, forks: 14, visibility: "Public", description: "Deploy autonomous agents to production" },
  { name: "ai-opencog", url: "https://github.com/cogpy/ai-opencog", language: "TypeScript", stars: 0, forks: 4, visibility: "Public", description: "OC" },
  { name: "aicogchat", url: "https://github.com/cogpy/aicogchat", language: "Rust", stars: 0, forks: 540, visibility: "Public", description: "All-in-one LLM CLI tool" },
  { name: "coganime", url: "https://github.com/cogpy/coganime", language: "JavaScript", stars: 0, forks: 4400, visibility: "Public", description: "JavaScript cognitive animation engine" },
  { name: "gitops-engine", url: "https://github.com/cogpy/gitops-engine", language: "Go", stars: 0, forks: 298, visibility: "Public", description: "Democratizing GitOps" },
  { name: "KnowledgeGraph", url: "https://github.com/cogpy/KnowledgeGraph", language: "JavaScript", stars: 0, forks: 4, visibility: "Public", description: "Visualize knowledge graph in Semantic MediaWiki" },
  { name: "bolt.echo", url: "https://github.com/cogpy/bolt.echo", language: "TypeScript", stars: 0, forks: 14000, visibility: "Public", description: "Prompt, run, edit full-stack web applications" },
  { name: "cogbotbuilder-js", url: "https://github.com/cogpy/cogbotbuilder-js", language: "TypeScript", stars: 0, forks: 290, visibility: "Public", description: "CogBot Framework SDK for JavaScript" },
  { name: "shards", url: "https://github.com/cogpy/shards", language: "C++", stars: 0, forks: 17, visibility: "Public", description: "High-performance programming language" },
  { name: "openpi", url: "https://github.com/cogpy/openpi", language: "Python", stars: 1, forks: 1000, visibility: "Public" },
  { name: "ReZ", url: "https://github.com/cogpy/ReZ", language: "", stars: 0, forks: 1, visibility: "Public", description: "ReZ" },
  { name: "i2rt", url: "https://github.com/cogpy/i2rt", language: "Python", stars: 0, forks: 18, visibility: "Public" },
];

function Hypergraph() {
  const [repositories, setRepositories] = useState<Repository[]>(fallbackRepositories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const repos = await fetchOrgRepositories("cogpy");
        if (repos && repos.length > 0) {
          setRepositories(repos);
          console.log(`Loaded ${repos.length} repositories from GitHub API`);
        } else {
          console.warn("No repositories returned, using fallback data");
        }
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch repositories");
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Navigation */}
      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-screen-2xl items-center justify-between p-6 py-3">
        <Link to="/" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcherHome />
          <Link
            to="/"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Org HypergraphiQL</h1>
            <p className="text-muted-foreground">
              Interactive hypergraph visualization of the cogpy organization repositories
            </p>
            {loading && (
              <p className="text-sm text-muted-foreground mt-2">
                Loading repositories from GitHub...
              </p>
            )}
            {error && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                Warning: Using cached data. {error}
              </p>
            )}
            {!loading && !error && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ Loaded {repositories.length} repositories from GitHub API
              </p>
            )}
          </div>

          {/* Hypergraph Visualization */}
          <div className="bg-background rounded-lg border p-6 min-h-[600px]">
            <HypergraphVisualization repositories={repositories} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to group repositories by language
function groupRepositoriesByLanguage(repositories: Repository[]): Record<string, Repository[]> {
  return repositories.reduce((acc: Record<string, Repository[]>, repo: Repository) => {
    const lang = repo.language || "Other";
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(repo);
    return acc;
  }, {} as Record<string, Repository[]>);
}

function HypergraphVisualization({ repositories }: { repositories: Repository[] }) {
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  
  // Group repositories by language
  const languageGroups = useMemo(() => groupRepositoriesByLanguage(repositories), [repositories]);

  const languages = Object.keys(languageGroups).sort();
  
  // Filter repositories based on selected language
  const filteredRepos = useMemo(() => {
    if (!selectedLanguage) return repositories;
    return repositories.filter(r => (r.language || "Other") === selectedLanguage);
  }, [selectedLanguage, repositories]);

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("graph")}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              viewMode === "graph"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Graph View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            List View
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by language:</span>
          <select
            value={selectedLanguage || ""}
            onChange={(e) => setSelectedLanguage(e.target.value || null)}
            className="px-3 py-1.5 rounded-lg border bg-background text-sm"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang} ({languageGroups[lang].length})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {viewMode === "graph" ? (
        <GraphView repositories={filteredRepos} />
      ) : (
        <ListView repositories={filteredRepos} />
      )}
    </div>
  );
}

function GraphView({ repositories }: { repositories: Repository[] }) {
  const languageGroups = useMemo(() => groupRepositoriesByLanguage(repositories), [repositories]);
  const languages = Object.keys(languageGroups).sort();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Language Statistics */}
        {languages.map((lang) => (
          <div
            key={lang}
            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">{lang}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {languageGroups[lang].length} repositories
            </p>
            <div className="space-y-1">
              {languageGroups[lang].slice(0, 3).map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-primary hover:underline truncate"
                >
                  {repo.name}
                </a>
              ))}
              {languageGroups[lang].length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{languageGroups[lang].length - 3} more
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* SVG Network Graph */}
      <div className="bg-muted/30 rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">Organization Network</h3>
        <NetworkGraph repositories={repositories} />
      </div>
    </div>
  );
}

function NetworkGraph({ repositories }: { repositories: Repository[] }) {
  const width = 1200;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Group by language for positioning
  const languageGroups = useMemo(() => groupRepositoriesByLanguage(repositories), [repositories]);
  
  const languages = Object.keys(languageGroups);
  const langCount = languages.length;
  
  // Position nodes in clusters by language
  const nodes: { x: number; y: number; repo: Repository; language: string }[] = [];
  
  languages.forEach((lang, langIndex) => {
    const angle = (langIndex / langCount) * 2 * Math.PI;
    const clusterX = centerX + Math.cos(angle) * 250;
    const clusterY = centerY + Math.sin(angle) * 200;
    
    languageGroups[lang].forEach((repo, repoIndex) => {
      const count = languageGroups[lang].length;
      const spread = Math.min(count * 15, 150);
      const offset = ((repoIndex - count / 2) / count) * spread;
      
      nodes.push({
        x: clusterX + offset * Math.cos(angle + Math.PI / 2),
        y: clusterY + offset * Math.sin(angle + Math.PI / 2),
        repo,
        language: lang,
      });
    });
  });
  
  // Language colors
  const languageColors: Record<string, string> = {
    "Python": "#3572A5",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "C++": "#f34b7d",
    "C": "#555555",
    "Rust": "#dea584",
    "Go": "#00ADD8",
    "Java": "#b07219",
    "PHP": "#4F5D95",
    "HTML": "#e34c26",
    "C#": "#178600",
    "Scala": "#c22d40",
    "Shell": "#89e051",
    "Cypher": "#34c0eb",
    "Scheme": "#1e4aec",
    "CSS": "#563d7c",
    "Jupyter Notebook": "#DA5B0B",
    "Other": "#cccccc",
  };
  
  return (
    <div className="overflow-auto">
      <svg width={width} height={height} className="border rounded bg-card/50">
        {/* Draw edges from center to language clusters */}
        {languages.map((lang, langIndex) => {
          const angle = (langIndex / langCount) * 2 * Math.PI;
          const clusterX = centerX + Math.cos(angle) * 250;
          const clusterY = centerY + Math.sin(angle) * 200;
          
          return (
            <line
              key={`edge-${lang}`}
              x1={centerX}
              y1={centerY}
              x2={clusterX}
              y2={clusterY}
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
              className="text-muted-foreground"
            />
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <a href={node.repo.url} target="_blank" rel="noopener noreferrer">
              <circle
                cx={node.x}
                cy={node.y}
                r={Math.max(5, Math.min(3 + Math.sqrt(node.repo.forks / 100), 15))}
                fill={languageColors[node.language] || languageColors["Other"]}
                opacity="0.8"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              >
                <title>{node.repo.name} ({node.language})</title>
              </circle>
            </a>
          </g>
        ))}
        
        {/* Center node */}
        <circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill="currentColor"
          className="text-primary"
          opacity="0.8"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold fill-primary-foreground"
        >
          cogpy
        </text>
        
        {/* Language labels */}
        {languages.map((lang, langIndex) => {
          const angle = (langIndex / langCount) * 2 * Math.PI;
          const labelX = centerX + Math.cos(angle) * 320;
          const labelY = centerY + Math.sin(angle) * 250;
          
          return (
            <g key={`label-${lang}`}>
              <rect
                x={labelX - 40}
                y={labelY - 12}
                width="80"
                height="24"
                rx="4"
                fill={languageColors[lang] || languageColors["Other"]}
                opacity="0.9"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-white"
              >
                {lang}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ListView({ repositories }: { repositories: Repository[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        All Repositories ({repositories.length})
      </h2>
      <div className="grid gap-2">
        {repositories.map((repo) => (
          <div
            key={repo.name}
            className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {repo.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                {repo.language && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {repo.language}
                  </span>
                )}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  repo.visibility === "Public" && "bg-green-500/10 text-green-600",
                  repo.visibility === "Private" && "bg-red-500/10 text-red-600",
                  repo.visibility === "Internal" && "bg-yellow-500/10 text-yellow-600"
                )}>
                  {repo.visibility}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
