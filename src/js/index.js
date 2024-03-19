import '../scss/style.scss'



fetchDirectorys('redux');

function addDirectory() {

}

function fetchDirectorys(querry) {
  const directorys = fetch('https://api.github.com/search/repositories?q=' + querry + '%20in:name');

  if (directorys.then(res => res.ok)) {
    directorys.then(res => res.json().then(res => {
      for (let i = 0; i < 5; i++) {
        console.log(
          'name: ' + res.items[i].name +
          ' owner:' + res.items[i].owner.login +
          ' stars:' + res.items[i].stargazers_count);
      }
    }));
  } else {
    alert("Ошибка HTTP: " + directorys.status);
  }
}
