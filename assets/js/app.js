let state = {
  defaultList: [],
  list: [],
  filter: {
    status: "all",
    lang: "all",
  },
};

function getPodcastList() {
  return fetch("/podcasts.json")
    .then((res) => res.json())
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}

function rendeTreinamento() {
  const podcast = {
    name: "Procurando um mentor?",
    website_link: "https://github.com/training-center/mentoria",
  };

  return `
        <li class="list-item">
        <img class="list-item_image" src="/assets/img/centro-de-treinamento.png"  width="128" height="128">
            <div class="list-item_container">
                <div class="list-item_section">
                    <span class="list-item_status list-item_status--active"></span>
                    <h4 class="list-item_title">${podcast.name}</h4>
                </div>
                <ul class="list-item_links">
                ${
                  podcast.youtube_link
                    ? `<a class="list-item_links-item" href="${podcast.youtube_link}"> Youtube
                </a>`
                    : ""
                }
                ${
                  podcast.website_link
                    ? `<a class="list-item_links-item" href="${podcast.website_link}"> Site
                </a>`
                    : ""
                }
                ${
                  podcast.twitter_at
                    ? `<a class="list-item_links-item" href="htts://twitter.com/${podcast.twitter_at}"> Twitter                
                </a>`
                    : ""
                }
            </ul>
            </div>
            <p class="list-item_description">
                Mentoria, para ajudar novos(as) desenvolvedores(as) ou os(as) desenvolvedores(as) irem ao infinito e
                além em suas carreiras!
            </p>
        </li>
    `;
}

function renderStatusPodcast(podcst) {
  return `
    <span class="list-item_status ${
	    podcast.status
	    ? "list-item_status--active"
	    : "list-item_status--inactive"
    } "></span>`
}

function renderPodcast(podcast) {
  const data = `    
        <li class="list-item">
            <img class="list-item_image" src="${
              podcast.image ? podcast.image : "/assets/img/placeholder.png"
            }" width="128" height="128">
            <div class="list-item_container">
                <div class="list-item_section">
                    ${renderStatusPodcast(podcast)}
                    <h4 class="list-item_title">${podcast.name}</h4>
                </div>
                <ul class="list-item_links">
                    ${
                      podcast.youtube_link
                        ? `<a class="list-item_links-item" href="${podcast.youtube_link}"> Youtube
                    </a>`
                        : ""
                    }
                    ${
                      podcast.website_link
                        ? `<a class="list-item_links-item" href="${podcast.website_link}"> Site
                    </a>`
                        : ""
                    }
                    ${
                      podcast.twitter_at
                        ? `<a class="list-item_links-item" href="htts://twitter.com/${podcast.twitter_at}"> Twitter                
                    </a>`
                        : ""
                    }
                </ul>
            </div>
            <div class="list-item_description">
                ${podcast.description}
            </div>
        </li>
    `;

  return data;
}

function clearList() {
  const containerList = document.getElementById("list-podcast");
  containerList.innerHTML = "";
}

function renderList(listPodcast) {
  const containerList = document.getElementById("list-podcast");
  const ulList = document.createElement("ul");
  ulList.classList.add("list");
  const listPodcastString = listPodcast.reduce((acc, value) => {
    return acc + renderPodcast(value);
  }, "");
  ulList.innerHTML = rendeTreinamento() + listPodcastString;
  containerList.appendChild(ulList);
}

function searchList(word) {
  const newList = state.defaultList.filter((podcast) => {
    const nameSanitize = podcast.name.toLocaleLowerCase();
    const wordSanitize = word.toLocaleLowerCase();
    const hasItem = nameSanitize.includes(wordSanitize);
    return hasItem;
  });
  state.list = newList;
  clearList();
  renderList(state.list);
}

function changeState(podcast, status) {
  if (status === "all") {
    return true;
  }
  if (status === "active") {
    return podcast.status === true;
  }
  if (status === "inactive") {
    return podcast.status === false;
  }
  return false;
}

function filterState(status) {
  const newList = state.defaultList.filter((podcast) =>
    changeState(podcast, status),
  );
  state.filter.status = status;
  clearList();
  state.list = newList;
  renderList(state.list);
}

function changeLang(podcast, lang) {
  if (lang === "all") {
    return true;
  }
  return podcast.language == lang;
}

function filterLang(lang) {
  const newList = state.defaultList.filter((podcast) =>
    changeLang(podcast, lang),
  );
  state.filter.lang = lang;
  clearList();
  state.list = newList;
  renderList(state.list);
}

document.addEventListener("DOMContentLoaded", function (event) {
  const input = document.getElementById("search-input");
  if (input) {
    input.addEventListener("input", function (e) {
      searchList(e.target.value);
    });
  }

  const selectStatus = document.getElementById("status");
  if (selectStatus) {
    selectStatus.addEventListener("change", function (e) {
      filterState(e.target.value);
    });
  }

  const selectLang = document.getElementById("idioma");
  if (selectLang) {
    selectLang.addEventListener("change", function (e) {
      filterLang(e.target.value);
    });
  }

  getPodcastList().then((data) => {
    state.list = data;
    state.defaultList = data;
    renderList(state.list);
  });
});
