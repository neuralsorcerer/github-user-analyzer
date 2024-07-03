import axios from "axios";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

export const fetchGitHubUser = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    throw error;
  }
};

export const fetchGitHubRepos = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/users/${username}/repos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    throw error;
  }
};

export const fetchRepoLanguages = async (username: string, repo: string) => {
  try {
    const response = await axiosInstance.get(
      `/repos/${username}/${repo}/languages`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching languages for repo ${repo}:`, error);
    throw error;
  }
};
