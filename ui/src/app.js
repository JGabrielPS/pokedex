const favouritesList = [
  { id: 94, name: "abra" },
  { id: 134, name: "gengar" },
  { id: 34, name: "pichu" },
  { id: 43, name: "raichu" },
  { id: 316, name: "entei" },
  { id: 227, name: "mew" },
  { id: 7, name: "charizard" },
  { id: 12, name: "blastoise" },
  { id: 180, name: "scizor" },
  { id: 236, name: "feraligatr" }
];

const pokemonList = [];

let limit = 0;

function formData(event) {
  clearList(); //TODO eliminar el contenido de pokemonResults
  limit = 0;
  event.preventDefault();
  const name = document.getElementById("pokemonName").value;
  //busca en la lista y realiza consultas a la poke API con el ID
  pokemonInfo(name)
    .then(pokemonInfo => {
      //muestra informacion en el DOM
      displayInfo(pokemonInfo);
      //guardo informacion del pokemon
      savePokemonList(pokemonList, pokemonInfo.name, pokemonInfo.order);
      showSaveButton();
    })
    .catch(error => {
      displayError(error);
    });
}

function formList(event) {
  event.preventDefault();
  clearList();
  limit += 10;
  list(limit);
}

function agregarClase(div) {
  div.classList.toggle("seleccionado");
}

function showSaveButton(){
  document.querySelector('.btnSave').style.visibility = "visible";
}

function saveFavourites() {
  const checked = document.querySelectorAll(".seleccionado");
  [...checked].map(pokemon => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      pokemon.dataset.pokemonid
    );
  });
  console.log(favouritesList);
}

function pokemonInfo(param) {
  return new Promise((resolve, reject) => {
    const response = getPokemonData(param);
    if (typeof response === "object") resolve(response);
    else reject(response);
  });
}

function getPokemonData(param) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${param}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(handleError(error, "pokemon", param));
      });
  });
}

function displayInfo(pokemonInfo) {
  document.getElementById("pokemonResults").innerHTML += `
    <div class="card ${
      favouritesList.find(e => e.id === pokemonInfo.order) ? "seleccionado" : ""
    }" data-pokemonId="${pokemonInfo.order}" data-pokemonName="${
    pokemonInfo.name
  }" onClick="agregarClase(this)"> 
    <img src=${pokemonInfo.sprites.front_shiny} alt='${pokemonInfo.name}'>
    <hr>
    <div class="row">
      <p><strong>Nombre:</strong> ${pokemonInfo.name} shiny</p>
      <p><strong>Tipos:</strong> ${pokemonInfo.types.map(e => e.type.name)}</p>
      <p><strong>Peso:</strong> ${pokemonInfo.weight} lbs</p>
      <p><strong>Habilidades:</strong> ${pokemonInfo.abilities.map(
        e => e.ability.name
      )}</p>
    </div>
    </div>`;
}

function displayError(error) {
  document.getElementById("pokemonResults").innerHTML = `
    <p id="error-message">${error}</p>
  `;
}

function clearList() {
  document.getElementById("pokemonResults").innerHTML = "";
  document.querySelector('.btnSave').style.visibility = "hidden";
}

function handleError(error, typeElement, item) {
  switch (error.response.status) {
    case 404:
      return `Status Code: 404. Message: ${error.response.data} ${typeElement} ${item}`;

    default:
      return "Error no especificado";
  }
}

function savePokemonList(list, name, id) {
  if (list.every(e => e.name !== name)) {
    list.push({
      id: id,
      name: name
    });
  } else {
    console.log("El pokemon ya esta en la lista");
  }
}

function list(limitList) {
  for (let i = 1; i <= limitList; i++) {
    pokemonInfo(i)
      .then(response => {
        displayInfo(response);
      })
      .catch(error => {
        console.log(handleError(error, "pokemon", pokemon.name));
      });
  }
  showSaveButton();
}

function listFavourites() {
  clearList();
  if (favouritesList.length !== 0) {
    for (let i = 0; i < favouritesList.length; i++) {
      pokemonInfo(favouritesList[i].name)
        .then(response => {
          displayInfo(response);
        })
        .catch(error => {
          console.log(handleError(error, "pokemon", pokemon.name));
        });
    }
  } else {
    document.getElementById("pokemonResults").innerHTML +=
      "La lista de favoritos esta vacia";
  }
}

function listPokemons(limitList) {
  for (let i = 0; i < limitList; i++) {
    if (i < pokemonList.length) {
      const pokemon = pokemonList[i].name;
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
