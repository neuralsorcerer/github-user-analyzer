"use client";

import { useState } from "react";
import { GridLoader } from "react-spinners";
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchRepoLanguages,
} from "../lib/github";
import LanguageChart from "../components/LanguageChart";

interface User {
  name: string;
  followers: number;
  following: number;
  public_repos: number;
  bio: string;
  avatar_url: string;
  html_url: string;
}

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

interface LanguageStats {
  [key: string]: number;
}

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [reposData, setReposData] = useState<Repo[] | null>(null);
  const [languageStats, setLanguageStats] = useState<LanguageStats | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setUserData(null);
    setReposData(null);
    setLanguageStats(null);
    try {
      const user = await fetchGitHubUser(username);
      const repos = await fetchGitHubRepos(username);
      setUserData(user);
      setReposData(repos);

      const languageStats: LanguageStats = {};

      for (const repo of repos) {
        const languages = await fetchRepoLanguages(username, repo.name);
        for (const [language, bytes] of Object.entries(languages)) {
          if (languageStats[language]) {
            languageStats[language] += bytes as number;
          } else {
            languageStats[language] = bytes as number;
          }
        }
      }

      console.log("Language Stats:", languageStats);
      setLanguageStats(languageStats);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);

      if (err.response) {
        if (err.response.status === 404) {
          setError(
            "GitHub user not found. Please check the username and try again."
          );
        } else {
          setError(
            "An error occurred while fetching data. Please try again later."
          );
        }
      } else {
        setError(
          "Failed to fetch data. Please check the username and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const parseBioWithLinks = (bio: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = bio.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
    return <p>{parts}</p>;
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-6 text-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub Username"
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleAnalyze}
            className="bg-pink-700 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded"
          >
            Analyze
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <GridLoader size={50} color={"#d10084"} loading={loading} />
          </div>
        )}

        {!loading && error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {!loading && userData && (
          <div className="bg-white shadow rounded p-6 mb-6 text-center">
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={userData.avatar_url}
                alt={`${userData.name}'s avatar`}
                className="rounded-full w-32 h-32 mx-auto mb-4 transition-transform transform hover:scale-105"
              />
            </a>
            <h2 className="text-3xl font-bold mb-2">{userData.name}</h2>
            <div className="text-gray-700 mb-4">
              {userData.bio
                ? parseBioWithLinks(userData.bio)
                : "No bio available."}
            </div>
            <div className="flex justify-center space-x-4">
              <span className="bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700">
                Followers: {userData.followers}
              </span>
              <span className="bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700">
                Following: {userData.following}
              </span>
              <span className="bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700">
                Public Repos: {userData.public_repos}
              </span>
            </div>
          </div>
        )}

        {!loading && languageStats && (
          <div className="mt-6 p-6 rounded shadow ">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Languages Used
            </h3>
            <div className="bg-white p-6 rounded shadow flex items-center justify-center text-gray-800">
              <div className="w-full max-w-md">
                <LanguageChart languageStats={languageStats} />
              </div>
            </div>
          </div>
        )}

        {!loading && reposData && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Repositories:</h3>
            <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-100 rounded">
              {reposData.map((repo) => (
                <div
                  key={repo.id}
                  className="min-w-[200px] max-w-xs flex-shrink-0 bg-white shadow rounded p-4 cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => window.open(repo.html_url, "_blank")}
                >
                  <h4 className="text-lg font-medium">{repo.name}</h4>
                  <p className="text-gray-700">{repo.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
