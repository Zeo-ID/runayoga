/**
 * GitHub API client for content management.
 * Runs client-side — owner/repo/branch come from site.json, token from localStorage.
 */

import siteData from "../data/site.json";

const GITHUB_API = "https://api.github.com";

function getConfig() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("github_token");
  if (!token) return null;
  const gh = (siteData as any).github;
  if (!gh?.owner || !gh?.repo) return null;
  return { token, owner: gh.owner, repo: gh.repo, branch: gh.branch || "main" };
}

function headers(token: string) {
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function loadContent(path: string): Promise<any | null> {
  const cfg = getConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const decoded = atob(data.content.replace(/\n/g, ""));
    return { content: JSON.parse(decoded), sha: data.sha };
  } catch {
    return null;
  }
}

export async function saveContent(
  path: string,
  content: object,
  message: string
): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) return false;

  let sha: string | undefined;
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet
  }

  const body: any = {
    message,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: headers(cfg.token),
      body: JSON.stringify(body),
    }
  );

  return res.ok;
}

export async function listImages(): Promise<
  { name: string; path: string; download_url: string; sha: string }[]
> {
  const cfg = getConfig();
  if (!cfg) return [];

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/public/images?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((f: any) =>
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name)
        )
      : [];
  } catch {
    return [];
  }
}

export async function uploadImage(
  filename: string,
  base64Content: string
): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) return false;

  const path = `public/images/${filename}`;
  let sha: string | undefined;
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch {}

  const body: any = {
    message: `Bild hochgeladen: ${filename}`,
    content: base64Content,
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: headers(cfg.token),
      body: JSON.stringify(body),
    }
  );

  return res.ok;
}

export async function listContentFiles(
  dir: string
): Promise<{ name: string; path: string }[]> {
  const cfg = getConfig();
  if (!cfg) return [];

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${dir}?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((f: any) => f.name.endsWith(".json"))
      : [];
  } catch {
    return [];
  }
}

export async function deleteContent(
  path: string,
  message: string
): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) return false;

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
      { headers: headers(cfg.token) }
    );
    if (!res.ok) return false;
    const data = await res.json();

    const delRes = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
      {
        method: "DELETE",
        headers: headers(cfg.token),
        body: JSON.stringify({
          message,
          sha: data.sha,
          branch: cfg.branch,
        }),
      }
    );
    return delRes.ok;
  } catch {
    return false;
  }
}
