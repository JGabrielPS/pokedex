function formData(event) {
  event.preventDefault();
  clearList(); //TODO eliminar el contenido de pokemonResults
  const name = document.getElementById("pokemonName").value;
  //busca en la lista y realiza consultas a la poke API con el ID
  pokemonInfo(name)
    .then(pokemonInfo => {
      //muestra informacion en el DOM
      displayInfo(pokemonInfo);
    })
    .catch(error => {
      alert(error);
    });
}

const pokemonInfo = name => {
  return new Promise((resolve, reject) => {
    const response = getPokemonData(name);
    if (typeof response !== Error) resolve(response);
    else reject(response);
  });
};

function getPokemonData(name) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function displayInfo(pokemonInfo) {
  document.getElementById("pokemonResults").innerHTML = `
    <img src=${pokemonInfo.sprites.front_shiny} alt='${pokemonInfo.name}'>`;
}

function clearList() {
    document.getElementById("pokemonResults").innerHTML = "";
}

// function listPokemons(quantity) {
//     for (let i = 1; i <= quantity; i++) {
//         axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
//         .then((response) => {
//             if(err) throw err;
//             return response.data;
//         })
//     }
// }
