// Constants
const GITHUB_API_BASE = 'https://api.github.com';
const SEARCH_ENDPOINT = '/search/users';
const REPOS_ENDPOINT = '/users';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    // Event Listeners
    githubForm.addEventListener('submit', handleSearch);

    // Functions
    async function handleSearch(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const users = await searchUsers(searchTerm);
            displayUsers(users);
        }
    }

    async function searchUsers(query) {
        const url = `${GITHUB_API_BASE}${SEARCH_ENDPOINT}?q=${query}`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data.items;
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button class="repo-btn" data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(userElement);
        });

        // Add event listeners to repo buttons
        document.querySelectorAll('.repo-btn').forEach(btn => {
            btn.addEventListener('click', handleRepoClick);
        });
    }

    async function handleRepoClick(event) {
        const username = event.target.getAttribute('data-username');
        const repos = await fetchUserRepos(username);
        displayRepos(repos);
    }

    async function fetchUserRepos(username) {
        const url = `${GITHUB_API_BASE}${REPOS_ENDPOINT}/${username}/repos`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return await response.json();
    }

    function displayRepos(repos) {
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const repoElement = document.createElement('li');
            repoElement.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description available'}</p>
            `;
            reposList.appendChild(repoElement);
        });
    }
});