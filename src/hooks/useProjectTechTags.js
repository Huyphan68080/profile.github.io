import { useEffect, useState } from 'react';

const GITHUB_API_BASE = 'https://api.github.com';
const MAX_TAGS = 8;

const TAG_PRIORITY = [
  'React',
  'Vite',
  'TailwindCSS',
  'Node.js',
  'Express',
  'MongoDB',
  'Render',
  'Next.js',
  'Vue',
  'Nuxt',
  'Svelte',
  'Astro',
  'TypeScript',
  'Framer Motion',
  'JavaScript',
  'HTML',
  'CSS',
];

const detectionCache = new Map();
const MAX_PACKAGE_FILES_TO_SCAN = 4;
const MAX_MARKDOWN_FILES_TO_SCAN = 3;

const isHttpUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const parseGitHubPagesInfo = (href) => {
  if (!isHttpUrl(href)) return null;

  const parsed = new URL(href);
  if (!parsed.hostname.endsWith('.github.io')) return null;

  const owner = parsed.hostname.split('.')[0];
  const segments = parsed.pathname.split('/').filter(Boolean);
  const repo = segments[0] || `${owner}.github.io`;

  if (!owner || !repo) return null;
  return { owner, repo };
};

const decodeBase64 = (value) => {
  if (typeof value !== 'string' || value.length === 0) return '';
  try {
    return atob(value.replace(/\n/g, ''));
  } catch {
    return '';
  }
};

const hasKeyword = (text, keywords) => {
  return keywords.some((keyword) => text.includes(keyword));
};

const detectFromMarkdown = (markdown, tags) => {
  if (typeof markdown !== 'string' || markdown.trim().length === 0) return;
  const content = markdown.toLowerCase();

  if (hasKeyword(content, ['react', 'reactjs', 'create react app'])) tags.add('React');
  if (hasKeyword(content, ['vite'])) tags.add('Vite');
  if (hasKeyword(content, ['tailwind'])) tags.add('TailwindCSS');
  if (hasKeyword(content, ['typescript'])) tags.add('TypeScript');
  if (hasKeyword(content, ['javascript', 'js'])) tags.add('JavaScript');
  if (hasKeyword(content, ['html'])) tags.add('HTML');
  if (hasKeyword(content, ['css', 'scss'])) tags.add('CSS');
  if (hasKeyword(content, ['node', 'nodejs'])) tags.add('Node.js');
  if (hasKeyword(content, ['express'])) tags.add('Express');
  if (hasKeyword(content, ['mongodb', 'mongoose'])) tags.add('MongoDB');
  if (hasKeyword(content, ['render.com', 'render yaml', 'render deployment', 'render database'])) tags.add('Render');
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
    },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const fetchFileContent = async (owner, repo, branch, path, signal) => {
  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const payload = await fetchJson(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
    signal,
  );
  return decodeBase64(payload?.content);
};

const findAnyPath = (paths, patterns) => {
  return patterns.some((pattern) => paths.some((path) => path === pattern || path.endsWith(pattern)));
};

const detectFromPaths = (paths, tags) => {
  if (findAnyPath(paths, ['package.json'])) tags.add('Node.js');
  if (findAnyPath(paths, ['render.yaml', 'render.yml'])) tags.add('Render');
  if (findAnyPath(paths, ['asset-manifest.json']) && paths.some((path) => path.startsWith('static/js/main'))) tags.add('React');
  if (findAnyPath(paths, ['vite.config.js', 'vite.config.ts', 'vite.config.mjs', 'vite.config.cjs'])) tags.add('Vite');
  if (findAnyPath(paths, ['tailwind.config.js', 'tailwind.config.ts'])) tags.add('TailwindCSS');
  if (findAnyPath(paths, ['next.config.js', 'next.config.mjs', 'next.config.ts'])) tags.add('Next.js');
  if (findAnyPath(paths, ['nuxt.config.js', 'nuxt.config.ts'])) tags.add('Nuxt');
  if (findAnyPath(paths, ['svelte.config.js', 'svelte.config.cjs'])) tags.add('Svelte');
  if (findAnyPath(paths, ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'])) tags.add('Astro');
  if (paths.some((path) => path.endsWith('.tsx') || path.endsWith('.ts'))) tags.add('TypeScript');
  if (paths.some((path) => path.endsWith('.jsx') || path.endsWith('.js'))) tags.add('JavaScript');
  if (paths.some((path) => path.endsWith('.html'))) tags.add('HTML');
  if (paths.some((path) => path.endsWith('.css') || path.endsWith('.scss'))) tags.add('CSS');
};

const detectFromPackageJson = (pkg, tags) => {
  if (!pkg || typeof pkg !== 'object') return;

  const dependencies = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
  };
  const keys = Object.keys(dependencies);

  if (keys.includes('react')) tags.add('React');
  if (keys.includes('next')) tags.add('Next.js');
  if (keys.includes('vue')) tags.add('Vue');
  if (keys.includes('nuxt')) tags.add('Nuxt');
  if (keys.includes('svelte')) tags.add('Svelte');
  if (keys.includes('astro')) tags.add('Astro');
  if (keys.includes('vite')) tags.add('Vite');
  if (keys.includes('typescript')) tags.add('TypeScript');
  if (keys.includes('tailwindcss')) tags.add('TailwindCSS');
  if (keys.includes('framer-motion')) tags.add('Framer Motion');
  if (keys.includes('express')) tags.add('Express');
  if (keys.includes('mongodb') || keys.includes('mongoose')) tags.add('MongoDB');
};

const normalizeTags = (tagSet) => {
  const unique = [...tagSet];
  if (unique.length === 0) return [];

  const byPriority = TAG_PRIORITY.filter((tag) => unique.includes(tag));
  const custom = unique.filter((tag) => !TAG_PRIORITY.includes(tag));
  return [...byPriority, ...custom].slice(0, MAX_TAGS);
};

const detectTagsForGitHubPages = async (href, signal) => {
  const repoInfo = parseGitHubPagesInfo(href);
  if (!repoInfo) return [];

  const { owner, repo } = repoInfo;
  const repoMeta = await fetchJson(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, signal);
  const branch = repoMeta?.default_branch || 'main';
  const treePayload = await fetchJson(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    signal,
  );

  const tree = Array.isArray(treePayload?.tree) ? treePayload.tree : [];
  const blobPaths = tree
    .filter((item) => item?.type === 'blob' && typeof item.path === 'string')
    .map((item) => item.path);
  const lowerPaths = blobPaths.map((path) => path.toLowerCase());

  const tags = new Set();
  detectFromPaths(lowerPaths, tags);

  const packageJsonPaths = blobPaths.filter((path) => path.toLowerCase().endsWith('package.json')).slice(0, MAX_PACKAGE_FILES_TO_SCAN);

  for (const packagePath of packageJsonPaths) {
    try {
      const decoded = await fetchFileContent(owner, repo, branch, packagePath, signal);
      if (!decoded) continue;
      const pkg = JSON.parse(decoded);
      detectFromPackageJson(pkg, tags);
    } catch {
      // Keep fallback tags from file path heuristics.
    }
  }

  const markdownPaths = blobPaths
    .filter((path) => {
      const lowered = path.toLowerCase();
      if (lowered.endsWith('.md')) return true;
      return /(\/|^)readme(\.[a-z0-9]+)?$/i.test(lowered);
    })
    .slice(0, MAX_MARKDOWN_FILES_TO_SCAN);

  for (const markdownPath of markdownPaths) {
    try {
      const markdown = await fetchFileContent(owner, repo, branch, markdownPath, signal);
      detectFromMarkdown(markdown, tags);
    } catch {
      // Keep already-detected tags.
    }
  }

  return normalizeTags(tags);
};

const getDetectedTags = async (href, signal) => {
  if (!isHttpUrl(href)) return [];
  return detectTagsForGitHubPages(href, signal);
};

const getCachedDetection = (href, signal) => {
  const cacheKey = href.trim();
  if (!cacheKey) return Promise.resolve([]);

  if (detectionCache.has(cacheKey)) {
    return detectionCache.get(cacheKey);
  }

  const promise = getDetectedTags(cacheKey, signal).catch(() => []);
  detectionCache.set(cacheKey, promise);
  return promise;
};

export const useProjectTechTags = (projectList) => {
  const [resolvedProjects, setResolvedProjects] = useState(projectList);

  useEffect(() => {
    setResolvedProjects(projectList);
  }, [projectList]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const enrichProjects = async () => {
      const nextProjects = await Promise.all(
        projectList.map(async (project) => {
          const href = typeof project.href === 'string' ? project.href.trim() : '';
          if (!href || href === '#') return project;

          const detectedTags = await getCachedDetection(href, controller.signal);
          if (!Array.isArray(detectedTags) || detectedTags.length === 0) return project;

          return { ...project, tags: detectedTags };
        }),
      );

      if (!mounted) return;
      setResolvedProjects(nextProjects);
    };

    enrichProjects();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [projectList]);

  return resolvedProjects;
};
