// let favouritesList = [
//   { id: 94, name: "abra" },
//   { id: 134, name: "gengar" },
//   { id: 34, name: "pichu" },
//   { id: 43, name: "raichu" },
//   { id: 316, name: "entei" },
//   { id: 227, name: "mew" },
//   { id: 7, name: "charizard" },
//   { id: 12, name: "blastoise" },
//   { id: 180, name: "scizor" },
//   { id: 236, name: "feraligatr" }
// ];

let favouritesList = [];

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
      displayInfo(pokemonInfo, "pokemonSearchResult");
      showSaveButton("savePokemon");
    })
    .catch(error => {
      displayError(error);
    });
}

function listPokemons() {
  clearList();
  limit += 10;
  list(limit);
}

function agregarClase(div) {
  div.classList.toggle("seleccionado");
}

function showSaveButton(button) {
  document.querySelector(`#${button}`).style.visibility = "visible";
}

function loadImg(img, element) {
  element.src = img;
}

function savePokemon() {
  const savedPokemon = document.querySelector(".seleccionado");
  savePokemonList(
    favouritesList,
    savedPokemon.dataset.pokemonname,
    +savedPokemon.dataset.pokemonid
  );
}

function saveFavourites() {
  const checked = document.querySelectorAll(".seleccionado.noListado");
  [...checked].map(pokemon => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      +pokemon.dataset.pokemonid
    );
  });
  console.log(favouritesList);
}

function saveChanges() {
  favouritesList = [];
  const checked = document.querySelectorAll(".seleccionado");
  [...checked].map(pokemon => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      +pokemon.dataset.pokemonid
    );
  });
  listFavourites();
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

function getPokemonsList(list) {
  return new Promise((resolve, reject) => {
    const response = getPokemons();
    if (typeof response === "object") resolve(response);
    else reject(response);
  });
}

function getPokemons() {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:3000/listPokemons")
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject("No se pudo conectar con la db.Error: ", error);
      });
  });
}

function displayInfo(pokemonInfo, element, cond) {
  document.getElementById(element).innerHTML += `
    <div class="card ${
      cond
        ? "seleccionado"
        : "noListado"
    }" data-pokemonId="${pokemonInfo.order}" data-pokemonName="${
    pokemonInfo.name
  }" onClick="agregarClase(this)"> 
    <img src='./rsc/load.gif' onload='loadImg("${
      pokemonInfo.sprites.front_shiny
    }", this)' alt='${pokemonInfo.name}'>
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
  document.getElementById("pokemonSearchResult").innerHTML = "";
  document.querySelector("#savePokemon").style.visibility = "hidden";
  document.querySelector("#saveFavourites").style.visibility = "hidden";
  document.querySelector("#saveChanges").style.visibility = "hidden";
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
  if (list.filter(e => e.name === name).length < 2) {
    list.push({
      id: id,
      name: name
    });
    console.log(`${name} fue agragado a los favoritos`);
  } else {
    alert("El pokemon ya esta en la lista dos veces");
  }
}

function list(limitList) {
  for (let i = 1; i <= limitList; i++) {
    pokemonInfo(i)
      .then(response => {
        displayInfo(response, "pokemonResults");
      })
      .catch(error => {
        console.log(handleError(error, "pokemon", pokemon.name));
      });
  }
  showSaveButton("saveFavourites");
}

function listFavourites() {
  clearList();
  showSaveButton("saveChanges");
  getPokemonsList()
    .then(pokemonsList => {
      favouritesList = pokemonsList;
      console.log(favouritesList);
      if (favouritesList.length !== 0) {
        for (let i = 0; i < favouritesList.length; i++) {
          pokemonInfo(favouritesList[i].pokemon_nombre)
            .then(response => {
              displayInfo(response, "pokemonResults", 1);
            })
            .catch(error => {
              console.log(handleError(error, "pokemon", favouritesList[i].pokemon_nombre));
            });
        }
      } else {
        document.getElementById("pokemonResults").innerHTML +=
          "La lista de favoritos esta vacia";
      }
    })
    .catch(error => {
      displayError(error);
    });
}

// function listPokemons(limitList) {
//   for (let i = 0; i < limitList; i++) {
//     if (i < pokemonList.length) {
//       const pokemon = pokemonList[i].name;
//       pokemonInfo(pokemon)
//         .then(response => {
//           displayInfo(response, "pokemonResults");
//         })
//         .catch(error => {
//           console.log(handleError(error, "pokemon", pokemon.name));
//         });
//     } else {
//       i = limitList;
//     }
//   }
// }
