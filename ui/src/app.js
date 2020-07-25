let favouritesList = [];
let limit = 0;
const userdata =
  document.getElementById("userdata") === null
    ? ""
    : document.getElementById("userdata").dataset.userid;

listPokemons(userdata);
listTeam(userdata);

function listPokemons(user) {
  clearList();
  let enableAddClass = false;
  limit += 10;
  if (user !== "") {
    enableAddClass = true;
    getPokemons(user)
      .then((pokemonData) => {
        favouritesList = [...pokemonData];
        console.log(favouritesList);
        displayPokemonList(
          limit,
          favouritesList,
          "pokemonResults",
          user,
          enableAddClass
        );
        showButton("saveFavourites");
        showButton("saveTeam");
      })
      .catch((error) => console.log(error));
  } else {
    displayPokemonList(
      limit,
      favouritesList,
      "pokemonResults",
      user,
      enableAddClass
    );
  }
}

function listFavourites(user) {
  clearList();
  showButton("saveChanges");
  showButton("deleteTeam");
  getPokemons(user)
    .then((pokemonData) => {
      if ([...pokemonData].length > 0) {
        [...pokemonData].map((pokemon) => {
          const count = pokemon.repeated;
          getPokemonData(pokemon.pokemon_name)
            .then((pokemonData) => {
              displayInfo(pokemonData, "pokemonResults", user, true, count);
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
  let enableAddClass = false;
  const name = document.getElementById("pokemonName").value;
  if (user !== "") {
    enableAddClass = true;
    getPokemons(user)
      .then((pokemonData) => {
        favouritesList = [...pokemonData];
        getPokemonData(name)
          .then((pokemonData) => {
            toogleSelectClassPokemon(
              favouritesList,
              pokemonData,
              "pokemonSearchResult",
              user,
              enableAddClass
            );
            if (user !== "") {
              showButton("savePokemon");
              showButton("savePokemonInTeam");
              showButton("deleteTeam");
            }
          })
          .catch((error) => {
            displayError(name, error);
          });
      })
      .catch((error) => console.log(error));
  } else {
    getPokemonData(name)
      .then((pokemonData) => {
        toogleSelectClassPokemon(
          favouritesList,
          pokemonData,
          "pokemonSearchResult",
          user,
          enableAddClass
        );
        if (user !== "") showButton("savePokemon");
      })
      .catch((error) => {
        displayError(name, error);
      });
  }
}

function saveSelectedPokemon(user, element) {
  const savedPokemon =
    document.querySelector(".seleccionado") === null
      ? ""
      : document.querySelector(".seleccionado");
  if (savedPokemon !== "") {
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
  } else {
    alert("No se selecciono ningun pokemon");
  }
}

function saveFavourites(user) {
  const checked = document.querySelectorAll(".seleccionado");
  if ([...checked].length > 0) {
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
        else
          alert(`Se guardaron: ${[...pass]} y estaban repetidos: ${[...err]}`);
      }
      console.log(resolve);
    });
    listPokemons(user);
  } else {
    alert("No se selecciono ningun pokemon");
  }
}

function saveChanges(user) {
  const checked = document.querySelectorAll(".card");
  const eliminados = [...checked].filter(
    (e) => e.getAttribute("class") === "card"
  );
  //console.log(eliminados.map(e => e.dataset.pokemonid));
  if (eliminados.length > 0) {
    const promises = [];
    eliminados.map((pokemon) =>
      promises.push(deletePokemonData(pokemon.dataset.pokemonid, user))
    );
    //console.log(promises);
    Promise.allSettled(promises).then((resolve) => {
      if (resolve.every((r) => r.status === "rejected")) {
        alert(`Error al eliminar los pokemones, ${[...r]}`);
      } else {
        let [pass, err] = [[], []];
        resolve.map((r) => {
          console.log(r);
          if (r.status === "fulfilled") pass.push(r.value);
          else err.push(r.reason);
        });
        if (err.length === 0) alert("Se eliminaron todos los pokemones");
        else
          alert(
            `Se eliminaron: ${[
              ...pass,
            ]}, los demas tuvieron los siguientes errores: ${[...err]}`
          );
      }
      console.log(resolve);
    });
    listFavourites(user);
  } else {
    alert("No se selecciono ningun pokemon");
  }
}

function listTeam(user) {
  clearTeamList();
  if (user !== "") {
    getPokemonTeam(user)
      .then((pokemonTeam) => {
        if ([...pokemonTeam].length > 0) {
          [...pokemonTeam].map((pokemon) => {
            getPokemonData(pokemon.pokemon_name)
              .then((pokemonData) => {
                displayPokemonInTeam(pokemonData);
              })
              .catch((error) => {
                alert(error);
              });
          });
          showButton("deleteTeam");
        } else {
          document.getElementById("teamResults").innerHTML +=
            "La lista del equipo esta vacia";
        }
      })
      .catch((error) => alert(error));
  } else {
    console.log("No hay usuario logueado");
  }
}

function saveSelectedPokemonInTeam(user) {
  const savedPokemon =
    document.querySelector(".seleccionado") === null
      ? ""
      : document.querySelector(".seleccionado");
  if (savedPokemon !== "") {
    savePokemonInTeam(
      user,
      +savedPokemon.dataset.pokemonid,
      savedPokemon.dataset.pokemonname
    )
      .then((response) => {
        console.log(response);
        alert(`Se guardo a ${response} con exito`);
        listTeam(user);
      })
      .catch((error) => {
        console.log(error);
        alert(`Error: ${error.status}, el pokemon esta repetido`);
      });
  } else {
    alert("No se selecciono ningun pokemon");
  }
}

function saveTeam(user) {
  const checked = document.querySelectorAll(".seleccionado");
  //console.log([...checked].length);
  //console.log([...checked].map((pokemon) => pokemon.dataset.pokemonid));
  if ([...checked].length > 0) {
    let promises = [];
    [...checked].map((pokemon) =>
      promises.push(
        savePokemonInTeam(
          user,
          pokemon.dataset.pokemonid,
          pokemon.dataset.pokemonname
        )
      )
    );
    Promise.allSettled(promises).then((resolve) => {
      if (resolve.every((r) => r.status === "rejected")) {
        alert("El equipo esta lleno");
      } else {
        let [pass, err] = [[], []];
        resolve.map((r) => {
          console.log(r);
          if (r.status === "fulfilled") pass.push(r.value);
          else err.push(r.reason.data);
        });
        if (err.length === 0) alert("Se guardaron todos los pokemones");
        else
          alert(`Se guardaron: ${[...pass]} y estaban repetidos: ${[...err]}`);
        listTeam(user);
      }
      console.log(resolve);
    });
    //listTeam(user)
  } else {
    alert("No se selecciono ningun pokemon");
  }
}

function deletePokemonsInTeam(user) {
  const checked = document.querySelectorAll(".miniatura");
  const eliminados = [...checked].filter(
    (e) => e.getAttribute("class") === "miniatura"
  );
  //console.log(eliminados);
  //console.log(eliminados.map((e) => e.dataset.pokemonid));
  if (eliminados.length > 0) {
    const promises = [];
    eliminados.map((pokemon) =>
      promises.push(deletePokemonInTeam(pokemon.dataset.pokemonid, user))
    );
    //console.log(promises);
    Promise.allSettled(promises).then((resolve) => {
      if (resolve.every((r) => r.status === "rejected")) {
        alert(`Error al eliminar los pokemones, ${[...r]}`);
      } else {
        let [pass, err] = [[], []];
        resolve.map((r) => {
          console.log(r);
          if (r.status === "fulfilled") pass.push(r.value);
          else err.push(r.reason);
        });
        if (err.length === 0) alert("Se eliminaron todos los pokemones");
        else
          alert(
            `Se eliminaron: ${[
              ...pass,
            ]}, los demas tuvieron los siguientes errores: ${[...err]}`
          );
      }
      console.log(resolve);
    });
    listTeam(user);
  } else {
    alert("No se selecciono ningun pokemon");
  }
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

function deletePokemonData(pokemonid, user) {
  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: `http://localhost:3000/collection/deletePokemon/${user}`,
      data: {
        order: `${pokemonid}`,
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

function getPokemonTeam(user) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:3000/team/listPokemons/${user}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

function savePokemonInTeam(user, pokemon_order, pokemon_name) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://localhost:3000/team/savePokemon", {
        user,
        order: `${pokemon_order}`,
        name: `${pokemon_name}`,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
}

function deletePokemonInTeam(pokemonid, user) {
  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: `http://localhost:3000/team/deletePokemon/${user}`,
      data: {
        order: `${pokemonid}`,
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

function displayPokemonList(limit, list, element, user, enableAddClass) {
  for (let i = 1; i <= limit; i++) {
    getPokemonData(i)
      .then((pokemonData) => {
        toogleSelectClassPokemon(
          list,
          pokemonData,
          element,
          user,
          enableAddClass
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function toogleSelectClassPokemon(
  list,
  pokemonData,
  element,
  user,
  enableAddClass
) {
  //console.log(list, pokemonData.name);
  const findPokemon = list.find(
    (pokemon) => pokemon.pokemon_name === pokemonData.name
  );
  //console.log(findPokemon);
  if (findPokemon !== undefined) {
    const count = list.find(
      (pokemon) => pokemon.pokemon_name === pokemonData.name
    ).repeated;
    displayInfo(pokemonData, element, user, enableAddClass, count);
  } else {
    displayInfo(pokemonData, element, "", enableAddClass, 0);
  }
}

function displayInfo(pokemonInfo, element, user, addClassEnabled, count) {
  document.getElementById(element).innerHTML += `
    <div class="card ${
      user === "" || user === undefined ? "noListado" : "seleccionado"
    }" data-pokemonId="${pokemonInfo.id}" data-pokemonName="${
    pokemonInfo.name
  }" data-pokemonCount="${count}" ${
    addClassEnabled ? "onClick='addClass(this)'" : ""
  } > 
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
      <p ${
        user === "" || user === undefined ? "hidden" : ""
      }><strong>${count}</strong></p>
    </div>
    </div>`;
}

function displayPokemonInTeam(pokemonInfo) {
  document.getElementById("teamResults").innerHTML += `
  <img class="miniatura enEquipo" data-pokemonId="${pokemonInfo.id}" data-pokemonName="${pokemonInfo.name}" src='./rsc/load.gif' onload='loadImg("${pokemonInfo.sprites.front_shiny}", this)' alt='${pokemonInfo.name}' onClick="addClassImg(this)">
  `;
}

function addClass(div) {
  div.classList.toggle("seleccionado");
}

function addClassImg(img) {
  img.classList.toggle("enEquipo");
}

function displayError(element, error) {
  console.log(error);
  document.getElementById("pokemonResults").innerHTML = `
    <p id="error-message">${element} ${error.data}, error ${error.status}</p>
  `;
}

function showButton(button) {
  document.querySelector(`#${button}`).style.visibility = "visible";
}

function loadImg(img, element) {
  element.src = img;
}

function clearTeamList() {
  document.getElementById("teamResults").innerHTML = "";
}

function clearList() {
  document.getElementById("pokemonResults").innerHTML = "";
  document.getElementById("pokemonSearchResult").innerHTML = "";
  document.querySelector("#savePokemon").style.visibility = "hidden";
  document.querySelector("#savePokemonInTeam").style.visibility = "hidden";
  document.querySelector("#saveFavourites").style.visibility = "hidden";
  document.querySelector("#saveChanges").style.visibility = "hidden";
  document.querySelector("#saveTeam").style.visibility = "hidden";
  document.querySelector("#deleteTeam").style.visibility = "hidden";
}

function handleError(error, typeElement, item) {
  switch (error.response.status) {
    case 404:
      return `Status Code: 404. Message: ${error.response.data} ${typeElement} ${item}`;

    default:
      return "Error no especificado";
  }
}
