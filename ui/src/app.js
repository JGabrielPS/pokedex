let favouritesList = [];
getPokemonsList()
  .then(pokemonList => {
    favouritesList = pokemonList;
    console.log(favouritesList);
  })
  .catch(error => {
    displayError(error);
  });

const pokemonList = [];

let limit = 0;

function formData(event) {
  clearList(); //TODO eliminar el contenido de pokemonResults
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

function saveSelectedPokemon() {
  const savedPokemon = document.querySelector(".seleccionado");
  savePokemon(savedPokemon.dataset.pokemonname, +savedPokemon.dataset.pokemonid)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      alert(error);
    });
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

function getPokemonsList() {
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
        reject("No se pudo conectar con la db.Error: " + error);
      });
  });
}

function savePokemonList(list, name, id) {
  if (list.filter(e => e.name === name).length < 2) {
    savePokemon(id, name)
      .then(mensaje => {
        console.log(mensaje);
        list.push({
          id: id,
          name: name
        });
      })
      .catch(error => {
        alert(error);
      });
  } else {
    alert("El pokemon ya esta en la lista dos veces");
  }
}

function savePokemon(name, id) {
  return new Promise((resolve, reject) => {
    const response = savePokemonData(name, id);
    if (response === 200) resolve("El Pokemon Se Guardo con Exito");
    else reject(response);
  });
}

function savePokemonData(name, id) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://localhost:3000/saveFavouritePokemon", {
        id: id,
        name: `${name}`
      })
      .then(response => {
        console.log(response)
        resolve(response.status);
      })
      .catch(error => {
        reject("No se pudo guardar el error. Mensaje: " + error);
      });
  });
}

function displayInfo(pokemonInfo, element, cond) {
  document.getElementById(element).innerHTML += `
    <div class="card ${cond ? "seleccionado" : "noListado"}" data-pokemonId="${
    pokemonInfo.order
  }" data-pokemonName="${pokemonInfo.name}" onClick="agregarClase(this)"> 
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
  if (favouritesList.length !== 0) {
    for (let i = 0; i < favouritesList.length; i++) {
      pokemonInfo(favouritesList[i].pokemon_name)
        .then(response => {
          displayInfo(response, "pokemonResults", 1);
        })
        .catch(error => {
          console.log(
            handleError(error, "pokemon", favouritesList[i].pokemon_name)
          );
        });
    }
  } else {
    document.getElementById("pokemonResults").innerHTML +=
      "La lista de favoritos esta vacia";
  }
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
