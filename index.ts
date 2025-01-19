interface GithubUserResponse {
    id: number
    login: string
    name: string
    bio: string
    public_repos: number
    repos_url: string
    message?: "Not Found"
}

interface GithubRepoResponse {
    name: string
    description: string
    fork: boolean
    stargazers_count: number
}

const users: GithubUserResponse[] = [];

async function fetchUser(username: string) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const user: GithubUserResponse = await response.json();

        if (user.message) {
            console.error('User not found!');
        } else {
            users.push(user);
            console.log(
                `User ${user.login} has been saved.\n` +
                `\nid: ${user.id}` +
                `\nlogin: ${user.login}` +
                `\nName: ${user.name}` +
                `\nBio: ${user.bio}` +
                `\nPublic Repositories: ${user.public_repos}`
            );
        }
    } catch (error) {
        console.error('An error occurred while fetching user:', error);
    }
}

async function showUser(username: string) {
    const user = users.find(user => user.login === username);

    if (!user) {
        console.error('User not found in the local list!');
    } else {
        try {
            const response = await fetch(user.repos_url);
            const repos: GithubRepoResponse[] = await response.json();

            let message = `id: ${user.id}\n` +
                `\nlogin: ${user.login}` +
                `\nName: ${user.name}` +
                `\nBio: ${user.bio}` +
                `\nPublic Repositories: ${user.public_repos}`;

            repos.forEach(repo => {
                message += `\nName: ${repo.name}` +
                    `\nDescription: ${repo.description}` +
                    `\nStars: ${repo.stargazers_count}` +
                    `\nIs Fork: ${repo.fork ? 'Yes' : 'No'}\n`;
            });

            console.log(message);
        } catch (error) {
            console.error('An error occurred while fetching repositories:', error);
        }
    }
}

function displayAllUsers() {
    let message = 'Users:\n';

    users.forEach(user => {
        message += `\n- ${user.login}`;
    });
    console.log(message);
}

function displayTotalRepos() {
    const totalRepos = users.reduce((acc, user) => acc + user.public_repos, 0);

    console.log(`The group has a total of ${totalRepos} public repositories!`);
}

function displayTopFiveUsers() {
    const topFive = users.slice().sort((a, b) => b.public_repos - a.public_repos).slice(0, 5);

    let message = 'Top 5 users with the most public repositories:\n';

    topFive.forEach((user, index) => {
        message += `\n${index + 1} - ${user.login}: ${user.public_repos} repositories`;
    });

    console.log(message);
}

async function main() {
    await fetchUser('Cjr-pjs');
    await fetchUser('randomUser1');
    await fetchUser('randomUser2');
    await fetchUser('randomUser3');
    await fetchUser('randomUser4');
    await fetchUser('randomUser5');

    await showUser('Cjr-pjs');
    await showUser('randomUser1');

    displayAllUsers();
    displayTotalRepos();
    displayTopFiveUsers();
}

main();
