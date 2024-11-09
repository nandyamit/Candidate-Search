// API.tsx
const getGitHubToken = () => {
  // Try multiple ways to access the token
  const token = 
    import.meta.env.VITE_GITHUB_TOKEN || 
    process.env.VITE_GITHUB_TOKEN;

  // Debug logging (remove in production)
  console.log('Environment check:', {
    importMetaEnvExists: !!import.meta.env,
    processEnvExists: !!process.env,
    hasImportMetaToken: !!import.meta.env.VITE_GITHUB_TOKEN,
    hasProcessToken: !!process.env.VITE_GITHUB_TOKEN,
  });

  if (!token) {
    throw new Error(
      'GitHub token not found. Please ensure:\n' +
      '1. .env file exists in project root\n' +
      '2. File contains VITE_GITHUB_TOKEN=your_token\n' +
      '3. You\'ve restarted the dev server after adding the token'
    );
  }
  return token;
};

const searchGithub = async () => {
  try {
    const token = getGitHubToken();
    const start = Math.floor(Math.random() * 100000000) + 1;
    
    const response = await fetch(
      `https://api.github.com/users?since=${start}`,
      {
        headers: {
          Authorization: `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API error ${response.status}: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching GitHub users:', err);
    throw err;
  }
};

const searchGithubUser = async (username: string) => {
  try {
    const token = getGitHubToken();
    
    const response = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API error ${response.status}: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching GitHub user:', err);
    throw err;
  }
};

export { searchGithub, searchGithubUser };