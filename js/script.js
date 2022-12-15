let instruction = "Welcome to the website, ";
let menu = "we have some options here: ";
let viewAllPokemon;
let addTeamMember;
let removePokemonId;

const pokemonList = [];
const groupPokemonRandom = [];
const groupPokemonRandomId = [];
const myPokemonList = [];

//viewAllPokemonList
$("#getAllPokemon").click(function () {
  idInput = prompt("Please Key the ID range you want to view?(0-???)");
  idInputList = idInput.split("-");

  for (let i = idInputList[0]; i <= idInputList[1]; i++) {
    getPokemonNameById(i);
  }
  $("#viewAllPokemonHead").text(
    `Here are Pokemons from ID:${idInputList[0]}-${idInputList[1]}`
  );
});

//hideAllPokemonList
$("#hideAllPokemon").click(function () {
  $("#viewAllPokemon").toggle();
});

//removeAllPokrmon
$("#removeAllPokemon").click(function () {
  $("#viewAllPokemon").text("");
  $("#viewAllPokemonHead").text(`Here are Pokemon List:`);
});

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

// addTeam by clicking
$("div#viewAllPokemon").on("click", "#addTeam", function (evt) {
  addTeamMember = $(evt.target.parentElement.parentElement).clone();

  addTox = addTeamMember[0].children[1].innerHTML.replace("Add", "x");
  $(addTeamMember[0].children[1]).html(addTox);
  $(addTeamMember[0].children[1].children).attr("id", "remove");
  $(addTeamMember).appendTo($("#getMyTeam"));

  $(evt.target.parentElement.parentElement).addClass("circle");
});

// remove Teaam from myTeam
$("div#getMyTeam").on("click", "#remove", function (evt) {
  console.log(evt.target);
  $(evt.target.parentElement.parentElement).fadeOut();
  removePokemonId = evt.target.parentElement.innerHTML.split(":")[0];
  removeCircle(removePokemonId);
});

// go through circled obj, if circle, remove circle class
function removeCircle(removePokemonId) {
  $("div#viewAllPokemon")[0].childElementCount;
  //iterater all the childNotes, if hasCla==true, remove
  for (let pokemonInfo of $("div#viewAllPokemon")[0].childNodes) {
    if (pokemonInfo.children[1].innerHTML.split(":")[0] === removePokemonId) {
      pokemonInfo.classList.remove("circle");
    }
  }
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
      //push pokemon as obj into pokemonList
      pokemonList.push(pokemon);

      //retrieve pokemon's photo and id
      imgSrc = pokemon.sprites.other["official-artwork"].front_default;
      pokeIdandName = pokemon.id + ": " + pokemon.name;

      //created a jQuery obj with needed info and appendTo the div with #viewAllPokemon
      $("#viewAllPokemon").append(
        $(`<div class="pokemonInfo"><span class="pokemonImg">
          <img src=${imgSrc} width="100" height="100">
          </span>
          <span class="pokemonId">${pokeIdandName}
          <button id="addTeam">Add</button>
          </span>
          </div>
        `)
      );
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
