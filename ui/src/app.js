let favouritesList = [];
const pokemonList = [];

let limit = 0;

function listPokemons(user) {
  clearList();
  let enableAddClass = false;
  if (user !== "") {
    enableAddClass = true;
    getPokemons(user)
      .then((pokemonData) => {
        favouritesList = [...pokemonData];
      })
      .catch((error) => console.log(error));
  }
  limit += 10;
  for (let i = 1; i <= limit; i++) {
    getPokemonData(i)
      .then((pokemonData) => {
        toogleSelectClassPokemon(
          favouritesList,
          pokemonData,
          "pokemonResults",
          user,
          enableAddClass
        );
      })
      .catch((error) => {
        console.log(handleError(error, "pokemon", pokemon.name));
      });
  }
  if (user !== "") {
    showSaveButton("saveFavourites");
  }
}

function listFavourites(user) {
  clearList();
  showSaveButton("saveChanges");
  getPokemons(user)
    .then((pokemonData) => {
      if ([...pokemonData].length > 0) {
        [...pokemonData].map((pokemon) => {
          getPokemonData(pokemon.pokemon_name)
            .then((pokemonData) => {
              displayInfo(pokemonData, "pokemonResults", user, true);
            })
            .catch((error) => {
              alert(error);
            });
        });
      } else {
        document.getElementById("pokemonResults").innerHTML +=
          "La lista de favoritos esta vacia";
      }
    })
    .catch((error) => alert(error));
}

function searchPokemon(event, user) {
  clearList(); //TODO eliminar el contenido de pokemonResults
  event.preventDefault();
  const enableAddClass = user !== "" ? true : false;
  const name = document.getElementById("pokemonName").value;
  //busca en la lista y realiza consultas a la poke API con el ID
  getPokemonData(name)
    .then((pokemonData) => {
      toogleSelectClassPokemon(
        favouritesList,
        pokemonData,
        "pokemonSearchResult",
        user,
        enableAddClass
      );
      if (user !== "") showSaveButton("savePokemon");
    })
    .catch((error) => {
      displayError(error);
    });
}

function toogleSelectClassPokemon(
  list,
  pokemonData,
  element,
  user,
  enableAddClass
) {
  if (list.find((pokemon) => pokemon.pokemon_name === pokemonData.name)) {
    displayInfo(pokemonData, element, user, enableAddClass);
  } else {
    displayInfo(pokemonData, element, "", enableAddClass);
  }
}

function showSaveButton(button) {
  document.querySelector(`#${button}`).style.visibility = "visible";
}

function loadImg(img, element) {
  element.src = img;
}

function saveSelectedPokemon(user) {
  const savedPokemon = document.querySelector(".seleccionado");
  savePokemonData(
    user,
    +savedPokemon.dataset.pokemonid,
    savedPokemon.dataset.pokemonname
  )
    .then((response) => alert(`Se guardo a ${response} con exito`))
    .catch((error) => {
      console.log(error);
      alert(`Error: ${error.status}, ${error.data} esta repetido dos veces`);
    });
}

function saveFavourites(user) {
  const checked = document.querySelectorAll(".seleccionado.noListado");
  let promises = [];
  [...checked].map((pokemon) => {
    promises.push(
      savePokemonData(
        user,
        +pokemon.dataset.pokemonid,
        pokemon.dataset.pokemonname
      )
    );
  });
  Promise.allSettled(promises).then((resolve) => {
    if (resolve.every((r) => r.status === "rejected")) {
      alert("Todos los pokemones seleccionados estan repetidos dos veces");
    } else {
      let [pass, err] = [[], []];
      resolve.map((r, i) => {
        console.log(r);
        if (r.status === "fulfilled") pass.push(r.value);
        else err.push(r.reason.data);
      });
      if (err.length === 0) alert("Se guardaron todos los pokemones");
      else alert(`Se guardaron: ${[...pass]} y estaban repetidos: ${[...err]}`);
    }
    console.log(resolve);
  });
}

function saveChanges() {
  const checked = document.querySelectorAll(".card");
  const eliminados = [...checked].filter(
    (e) => e.getAttribute("class") === "card"
  );
  console.log(eliminados[0].dataset.pokemonid);
  eliminados.map((pokemon) =>
    deletePokemon(pokemon.dataset.pokemonid)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        alert(error);
      })
  );
  eliminados.forEach((eliminado) => {
    favouritesList = favouritesList.filter(
      (e) => e.pokemon_order !== +eliminado.dataset.pokemonid
    );
  });
  listFavourites();
}

function listFavouritesAgain(pokemons, callback) {
  pokemons.map((pokemon) => {
    savePokemonList(
      favouritesList,
      pokemon.dataset.pokemonname,
      +pokemon.dataset.pokemonid
    );
  });
  callback();
}

function getPokemonData(pokemon_name) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

function getPokemonsList() {
  return new Promise((resolve, reject) => {
    getPokemons()
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getPokemons(user) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:3000/collection/listPokemons/${user}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject("No se pudo conectar con la db. " + error);
      });
  });
}

function savePokemonData(user, pokemonid, pokemonname) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://localhost:3000/collection/savePokemon", {
        user: `${user}`,
        order: `${pokemonid}`,
        name: `${pokemonname}`,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

function deletePokemons() {
  return new Promise((resolve, reject) => {
    deletePokemonList()
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function deletePokemonList() {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://localhost:3000/collection/deletePokemonsList")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function deletePokemon(id) {
  return new Promise((resolve, reject) => {
    deletePokemonData(id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function deletePokemonData(id) {
  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: "http://localhost:3000/collection/deletePokemon",
      data: {
        id: `${id}`,
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function displayInfo(pokemonInfo, element, user, addClassEnabled) {
  document.getElementById(element).innerHTML += `
    <div class="card ${
      user === "" || user === undefined ? "noListado" : "seleccionado"
    }" data-pokemonId="${pokemonInfo.id}" data-pokemonName="${
    pokemonInfo.name
  }" ${addClassEnabled ? "onClick='addClass(this)'" : ""} > 
    <img src='./rsc/load.gif' onload='loadImg("${
      pokemonInfo.sprites.front_shiny
    }", this)' alt='${pokemonInfo.name}'>
    <hr>
    <div class="row">
      <p><strong>Nombre:</strong> ${pokemonInfo.name} shiny</p>
      <p><strong>Tipos:</strong> ${pokemonInfo.types.map(
        (e) => e.type.name
      )}</p>
      <p><strong>Peso:</strong> ${pokemonInfo.weight} lbs</p>
      <p><strong>Habilidades:</strong> ${pokemonInfo.abilities.map(
        (e) => e.ability.name
      )}</p>
    </div>
    </div>`;
}

function addClass(div) {
  div.classList.toggle("seleccionado");
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
