const pokemonList = [];

function formData(event) {
  clearList(); //TODO eliminar el contenido de pokemonResults
  event.preventDefault();
  const name = document.getElementById("pokemonName").value;
  //busca en la lista y realiza consultas a la poke API con el ID
  pokemonInfo(name)
    .then(pokemonInfo => {
      //muestra informacion en el DOM
      displayInfo(pokemonInfo);
      //guardo informacion del pokemon
      savePokemonList(pokemonInfo);
    })
    .catch(error => {
      displayError(error);
    });
}

function formList(event) {
  clearList();
  event.preventDefault();
  listPokemons();
}

function pokemonInfo(name) {
  return new Promise((resolve, reject) => {
    const response = getPokemonData(name);
    if (typeof response !== "string") resolve(response);
    else reject(response);
  });
}

function getPokemonData(name) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(handleError(error, "pokemon", name));
      });
  });
}

function displayInfo(pokemonInfo) {
  document.getElementById("pokemonResults").innerHTML += `
    <div class="card"> 
    <img src=${pokemonInfo.sprites.front_shiny} alt='${pokemonInfo.name}'>
    <hr>
    <div class="row">
      <p>Nombre: ${pokemonInfo.name} shiny</p>
      <p>Tipos: ${pokemonInfo.types.map(e => e.type.name)}</p>
      <p>Peso: ${pokemonInfo.weight} lbs</p>
      <p>Habilidades: ${pokemonInfo.abilities.map(e => e.ability.name)}</p>
    </div>
    </div>`;
}

function displayError(error) {
  document.getElementById("pokemonResults").innerHTML = `
    <p>${error}</p>
  `;
}

function clearList() {
  document.getElementById("pokemonResults").innerHTML = "";
}

function handleError(error, typeElement, item) {
  switch (error.response.status) {
    case 404:
      return `Status Code: 404. Message: ${error.response.data} ${typeElement} ${item}`;

    default:
      return "Error no especificado";
  }
}

function savePokemonList(pokemon) {
  if (pokemonList.every(e => e.name !== pokemon.name)) {
    pokemonList.push({
      id: pokemon.order,
      name: pokemon.name
    });
    console.log(pokemonList);
  } else {
    console.log("El pokemon ya esta en la lista");
  }
}

function listPokemons() {
  let limitList = 10;
  if([...document.querySelectorAll(".card")] > 10){
    limitList += 10;
  }
  for (let i = 0; i < limitList; i++) {
    if (i < pokemonList.length) {
      const pokemon = pokemonList[i].name;
      console.log(pokemon);
      pokemonInfo(pokemon)
        .then(response => {
          displayInfo(response);
        })
        .catch(error => {
          console.log(handleError(error, "pokemon", pokemon.name));
        });
    } else {
      i = limitList;
    }
  }
}
