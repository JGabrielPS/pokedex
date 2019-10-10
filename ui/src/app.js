function formData(event) {
    event.preventDefault();
    clearList(); //TODO eliminar el contenido de pokemonResults
    const name = document.getElementById('pokemonName').value;
    //busca en la lista y realiza consultas a la poke API con el ID
    const pokemonInfo = getPokemonData(name);
    //muestra informacion en el DOM
    displayInfo(pokemonInfo);
}

function getPokemonData(name) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response)=>{
        return response.data;
    });
}

function displayInfo(pokemonInfo) {
    
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

// function chooseBulbasaur(){
//     axios.get('https://pokeapi.co/api/v2/pokemon/1')
//     .then((response)=>{
//         document.getElementById('pokemon').innerHTML= `
//         <img src=${response.data.sprites.front_shiny} alt='bulbasaur'>
//         `;
//     });
// }
