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
  savePokemonList(
    favouritesList,
    savedPokemon.dataset.pokemonname,
    +savedPokemon.dataset.pokemonid,
    "alert"
  );
}

function saveFavourites() {
  const checked = document.querySelectorAll(".seleccionado.noListado");
  [...checked].map(pokemon => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      +pokemon.dataset.pokemonid,
      "list"
    );
  });
  console.log(favouritesList);
}

function saveChanges() {
  const checked = document.querySelectorAll(".card");
  const eliminados = [...checked].filter(
    e => e.getAttribute("class") === "card"
  );
  console.log(eliminados[0].dataset.pokemonid);
  eliminados.map(pokemon =>
    deletePokemon(pokemon.dataset.pokemonid)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        alert(error);
      })
  );
  eliminados.forEach(eliminado => {
    favouritesList = favouritesList.filter(
      e => e.pokemon_order !== +eliminado.dataset.pokemonid
    );
  });
  listFavourites();
}

function listFavouritesAgain(pokemons, callback) {
  pokemons.map(pokemon => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      +pokemon.dataset.pokemonid
    );
  });
  callback();
}

function pokemonInfo(param) {
  return new Promise((resolve, reject) => {
    getPokemonData(param)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
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
    getPokemons()
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
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

function savePokemonList(list, name, id, message) {
  if (list.filter(e => e.pokemon_name === name).length < 2) {
    savePokemon(name, id)
      .then(mensaje => {
        switch(message){
          case "one":
            alert(`${mensaje}: ${name}`);
            break;
            
          case "list":
            alert(`Los pokemons seleccionados fueron guardados con exito`);
            break;

            default:
              console.log(`${mensaje}: ${name}`);
              break;
        }
        // if (message === "alert") alert(`${mensaje}: ${name}`);
        // else console.log(`${mensaje}: ${name}`);
        list.push({
          pokemon_order: id,
          pokemon_name: name
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
    savePokemonData(name, id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
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
        resolve(response.data);
      })
      .catch(error => {
        reject("No se pudo guardar el error. Mensaje: " + error);
      });
  });
}

function deletePokemons() {
  return new Promise((resolve, reject) => {
    deletePokemonList()
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function deletePokemonList() {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://localhost:3000/deletePokemonsList")
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function deletePokemon(id) {
  return new Promise((resolve, reject) => {
    deletePokemonData(id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function deletePokemonData(id) {
  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: "http://localhost:3000/deletePokemon",
      data: {
        id: `${id}`
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function displayInfo(pokemonInfo, element, condition) {
  document.getElementById(element).innerHTML += `
    <div class="card ${
      condition === "selected" ? "seleccionado" : "noListado"
    }" data-pokemonId="${pokemonInfo.id}" data-pokemonName="${
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

function list(limitList) {
  for (let i = 1; i <= limitList; i++) {
    pokemonInfo(i)
      .then(response => {
        displayInfo(
          response,
          "pokemonResults",
          `${
            favouritesList.find(e => e.pokemon_order === response.order)
              ? "selected"
              : ""
          }`
        );
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
          displayInfo(response, "pokemonResults", "selected");
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
