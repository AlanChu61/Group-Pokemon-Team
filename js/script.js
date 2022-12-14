let instruction = "Welcome to the website, ";
let menu = "we have some options here: ";
let viewAllPokemon;
const groupPokemonByHand = [];
const groupPokemonRandom = [];
const groupPokemonRandomId = [];
const pokemonList = [];

$("#getPokemonListByRandom").click(function () {
  let imgSrc;
  let pokeIDandName;
  groupPokemonRandom.splice(0, groupPokemonRandom.length);
  getPokemoTeamRandom();
  $("#pokemonImg").text(" ");
  $("#pokemonId").text(" ");
  for (let pokemon of groupPokemonRandom) {
    //console.log(pokemon);
    imgSrc = pokemon.sprites.other["official-artwork"].front_default;
    pokeIDandName = pokemon.id + ": " + pokemon.name;
    $("#pokemonImg").append(
      `<td><img src=${imgSrc} width="100" height="100"></td>`
    );
    $("#pokemonId").append(`<td>${pokeIDandName}</td>`);
  }
});

$(document).ready(function () {
  //greeting
  // $("content").append(`<p>${instruction}</p>`);
  // menu
  //   $("content").append(`<ul>${menu}</ul>`);
  //   $("content").append(`<li>${viewAllPokemon}</li>`);
});

for (let i = 1; i <= 151; i++) {
  getPokemonNameById(i);
}

function getPokemonNameById(id) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon-form/${id}/`,
  })
    .then((result) => {
      getPokemonList(result.pokemon.name);
    })
    .catch((err) => {
      console.log("Bad Request", error);
    });
}

function getPokemonList(currentPokemonName) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${currentPokemonName}/`,
  })
    .then((pokemon) => {
      //console.log("result:", pokemon);
      pokemonList.push(pokemon);
      imgSrc = pokemon.sprites.other["official-artwork"].front_default;
      pokeIDandName = pokemon.id + ": " + pokemon.name;
      $("#allPokemonImg").append(
        `<td><img src=${imgSrc} width="100" height="100"></td>`
      );
      $("#allPokemonId").append(`<td>${pokeIDandName}</td>`);
    })
    .catch((err) => {
      console.log("Bad Request", error);
    });
}

function getPokemoTeamRandom() {
  while (true) {
    let intRand;
    intRand = Math.floor(Math.random() * 151) + 1;
    if (groupPokemonRandom.length >= 6) {
      break;
    } else {
      if (groupPokemonRandomId.includes(intRand)) {
        continue;
      } else {
        //console.log("int", intRand);
        groupPokemonRandomId.push(intRand);
        groupPokemonRandom.push(pokemonList[intRand - 1]);
      }
    }
  }
}
