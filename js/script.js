///start coding -- This is where your profile info will show
///Display's the users profile 
const overview = document.querySelector(".overview");

///stores the Github username
const username = "M-Ferry";

///will hold the list of repos
const repoList = document.querySelector(".repo-list");

///contains all repo-related elements
const allReposContainer = document.querySelector(".repos");

///will show detailed info about a single repo
const repoData = document.querySelector(".repo-data");

////allows the user to return to the list of repos
const viewReposButton = document.querySelector(".view-repos");

///is the search box for filtering repos
const filterInput = document.querySelector(".filter-repos");



//ASYNC Function
///the gitUserInfo function fetches the user's profile data from Github API and then
////......calls displayUserInfo to display the fetched data
const gitUserInfo = async function () {
     const userInfo = await fetch (`https://api.github.com/users/${username}`);
    //console.log(userInfo);
    const data = await userInfo.json();
     displayUserInfo(data);
};

gitUserInfo();

////the displayUserInfo function creates a new div element, adds a class userInfo
/////....and populates it with the useers Avatar, name, bio, location and the number
////....of public repos. This div is then apppended to the overView element. After displaying
////.....the user info, it calls gitRepos to fetch and display the repos
const displayUserInfo = function (data) {
     const div = document.createElement("div");
     div.classList.add("user-info");
     div.innerHTML = `
     <figure>
          <img alt="user avatar" src=${data.avatar_url} />
     </figure>

     <div>
          <p><strong>Name: </strong>${data.name}</p>
          <p><strong>Bio: </strong>${data.bio}</p>
          <p><strong>Location: </strong>${data.location}</p>
          <p><strong>Number of public repos: </strong>${data.public_repos}</p>
     </div>
     `;
     overview.append(div);
     gitRepos();
};
//ANOTHER ASYNC FUNCTION
////the getRepos function fetches the repos of the user, sorts them by the last updated date,
/////...and limits the results to 100.  It then calls displaysRepos to display the fetched repos
const gitRepos = async function () {
const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
const repoData = await fetchRepos.json();
     //console.log(repoData);
displayRepos(repoData);
};

///the displayRepos function takes an array of repos, makes the filter input invisible, and for 
////....each repo, creates a list item (li) element. Each 'li' contains the repos name in an 'h3'
////...element. These list items are appended to the 'repoList'.
const displayRepos = function (repos) {
     filterInput.classList.remove("hide");
     for (const repo of repos) {
          const repoItem = document.createElement("li");
          repoItem.classList.add("repo");
          repoItem.innerHTML =`<h3>${repo.name}</h3>`;
          repoList.append(repoItem);
     }

};

////this event listener checks if the clicked element is an 'h3' (repo name). If so, it calls
////...'getRepoInfo' with the repo name.
repoList.addEventListener("click", function (e) {
     if (e.target.matches("h3")) {
      const repoName = e.target.innerText;
     // console.log(repoName);
      getRepoInfo(repoName);

     }
});

///The 'getRepoInfo' function fetches detailed information  about a repo , includes its 
///....languages. It collects all languages used in the repo and calls 'displayRepoInfo'
////..to display the repo's details
const getRepoInfo = async function (repoName) {
     const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
     const repoInfo = await fetchInfo.json();
     //console.log(repoInfo);
     //Grab languages
     const fetchLanguages = await fetch(repoInfo.languages_url);
     const languageData = await fetchLanguages.json();

     // Make a list of languages
     const languages = [];
     for (const language in languageData) {
          languages.push(language);
 }
     displayRepoInfo(repoInfo, languages);
};

///The 'displayRepoInfo' function makes the 'View Repos' button visible, clears previous repos data, hides
////....the repo list container, and shows the detailed repo data. It creates a new 'div' element and fills
////....it with the repo's details such as name, description, default branch, languages used, and a link
////...to the repo on Github.
const displayRepoInfo = function (repoInfo, languages) {
     viewReposButton.classList.remove("hide");
     repoData.innerHTML = "";
     repoData.classList.remove("hide");
     allReposContainer.classList.add("hide");
     
     const div = document.createElement("div");
     div.innerHTML = `
     <h3>Name: ${repoInfo.name}</h3>
     <p>Description: ${repoInfo.description}</p>
     <p>Default Branch: ${repoInfo.default_branch}</p>
     <p>Languages: ${languages.join(", ")}</p>
     <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on Github!</a>
     `;

     repoData.append(div);
};
////This event listener filters the displayed repos based on the user's input in the search box.
////....It converts the search text and repo names to lowercase to make the search case-insensitive. If 
/////....a repo name includes the search text, it remains visible, otherwise it is hidden.
viewReposButton.addEventListener("click", function () {
     allReposContainer.classList.remove("hide");
     repoData.classList.add("hide");
     viewReposButton.classList.add("hide");
});

////SEARCH BOX
////This event listener hides the detailed repo view and shows the list of repos when the 'View Repos'
////...button is clicked.
filterInput.addEventListener("input", function (e) {
     const searchText = e.target.value;
     const repos = document.querySelectorAll(".repo"); 
     const searchLowerText = searchText.toLowerCase();
     
     for (const repo of repos) {
          const repoLowerText = repo.innerText.toLowerCase();
          if (repoLowerText.includes(searchLowerText)) {
          repo.classList.remove("hide");
          } else {
          repo.classList.add("hide");
          }
   }
 });









