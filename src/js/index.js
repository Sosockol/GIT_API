import '../scss/style.scss'

const searchArea = document.querySelector('#search');

const createDirectory = (repository) => {
  const template = document.querySelector('.template').content;
  const directory = template.querySelector('.directory').cloneNode(true);
  const dirName = directory.querySelector('.directory__name');
  const dirOwner = directory.querySelector('.directory__owner');
  const dirStars = directory.querySelector('.directory__stars');

  dirName.textContent = 'name: ' + repository.name;
  dirOwner.textContent = 'owner: ' + repository.owner;
  dirStars.textContent = 'stars: ' + repository.stars;

  const crossButton = directory.querySelector('.directory__remove');
  crossButton.onclick = () => {
    directory.remove();
    crossButton.onclick = '';
  };

  const container = document.querySelector('.dirContainer');
  container.prepend(directory);

  searchArea.value = '';
  fillDropdown([]);
}

const setEventListener = (element, repo) => {
  element.onclick = () => {
    createDirectory(repo);
    element.onclick = '';
  }
}

const fillDropdown = (repositorys) => {
  const dropdown = document.querySelector('.dropdown');
  const dropdownElements = Array.from(dropdown.children);
  if (!repositorys.length) {
    for (let i = 0; i < 5; i++) {
      dropdownElements[i].style.visibility = 'hidden';
      dropdownElements[i].onclick = '';
    }
    return;
  }
  for (let i = 0; i < 5; i++) {
    if (i >= repositorys.length) {
      dropdownElements[i].style.visibility = 'hidden';
      dropdownElements[i].onclick = '';
    } else {
      dropdownElements[i].textContent = repositorys[i].name;
      dropdownElements[i].style.visibility = 'visible';
      setEventListener(dropdownElements[i], repositorys[i]);
    }
  }
}

const fetchDirectorys = (querry) => {
  querry = querry.trim();
  if (!querry) {
    return new Promise(resolve => resolve([]));
  }

  const directorys = fetch('https://api.github.com/search/repositories?q=' + querry + '%20in:name');

  if (!directorys.then(res => res.ok)) {
    return new Promise(resolve => resolve([]));
  }

  const repoPromise = directorys
    .then(dirArray => dirArray.json())
    .then(dirArray => {
      if (!dirArray.items.length) {
        return new Promise(resolve => resolve([]));
      }

      const repoLength = 5 < dirArray.items.length ? 5 : dirArray.items.length;
      const repositories = [];
      for (let i = 0; i < repoLength; i++) {
        let name = dirArray.items[i].name ? dirArray.items[i].name : 'nothing';
        let owner = dirArray.items[i].owner.login ? dirArray.items[i].owner.login : 'nothing';
        let stars = dirArray.items[i].stargazers_count ? dirArray.items[i].stargazers_count : 'nothing';
        let repoObj = {
          name: name,
          owner: owner,
          stars: stars,
        }
        repositories.push(repoObj);
      }

      return repositories;
    });

  return new Promise((resolve, reject) => {
    repoPromise.then(res => resolve(res)).catch(err => reject(err));
  });
}

let timer = 0;

searchArea.addEventListener('keyup', (evt) => {
  function deb() {
    clearTimeout(timer);
    timer = setTimeout(() => fetchDirectorys(searchArea.value).then(fillDropdown), 400);
  }
  deb();
});

