export function fetchStargazers(repoOrg, repoName, starCount) {
  const query = `{
    repository(owner: "${repoOrg}", name: "${repoName}") {
      stargazers(first: 100) {
        edges {
          starredAt
          node {
            avatarUrl
            name
            login
          }
          cursor
        }
      }
    }
  }`;

  console.log(
    "t:",
    !process.env.GITHUB_TOKEN
      ? "No token"
      : process.env.GITHUB_TOKEN.slice(0, 4)
  );

  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "token " + process.env.GITHUB_TOKEN,
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((textResponse) => {
          throw Error(`HTTP ${res.status} ${res.statusText}: ${textResponse}`);
        });
      }
      return res.json();
    })
    .then((res) => {
      const { edges } = res.data.repository.stargazers;
      return edges.map((edge) => ({
        avatarUrl: edge.node.avatarUrl,
        date: edge.starredAt,
        name: edge.node.name || edge.node.login,
      }));
    })
    .catch((e) => console.error(e));
}