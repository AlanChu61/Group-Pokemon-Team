let imgSrc;
let pokeIdandName;
let viewAllPokemon;
let addTeamMember;
let removePokemonId;

//pokemonArray with pokemon as obj
const pokemonList = [];
const groupPokemonRandomId = [];
const myPokemonList = [];

//docuemnt ready and build allPokemonList
$(document).ready(function () {
  for (let i = 1; i <= 151; i++) {
    getPokemonNameById(i);
  }
});

//viewAllPokemonList
$("#getAllPokemon").click(function () {
  idInput = prompt("Please Key the ID range you want to view?(0-???)");
  idInputList = idInput.split("-");

  //modify header
  $("#viewAllPokemonHead").text(
    `Here are Pokemons from ID:${idInputList[0]}-${idInputList[1]}`
  );
  //read pokemonList and load pokemon into grid based on given id
  for (let i = idInputList[0]; i <= idInputList[1]; i++) {
    //retrieve pokemon's photo and id
    imgSrc = pokemonList[i - 1].sprites.other["official-artwork"].front_default;
    pokeIdandName = pokemonList[i - 1].id + ": " + pokemonList[i - 1].name;

    //created a jQuery obj with needed info and appendTo the div with #viewAllPokemon
    $("#viewAllPokemon").append(
      $(`<div class="pokemonInfo"><span class="pokemonImg">
            <img src=${imgSrc} width="100" height="100">
            </span>
            <span class="pokemonId">${pokeIdandName}<br>
            <button id="addTeam">Add</button>
            </span>
            </div>
          `)
    );
  }
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
  groupPokemonRandomId.splice(0, groupPokemonRandomId.length);
  getPokemoTeamRandom();
  groupPokemonRandomId.sort(function (a, b) {
    return a - b;
  });
  $("#getPokemonRand").text("");
  for (let pokemonId of groupPokemonRandomId) {
    imgSrc =
      pokemonList[pokemonId - 1].sprites.other["official-artwork"]
        .front_default;
    pokeIdandName =
      pokemonList[pokemonId - 1].id + ": " + pokemonList[pokemonId - 1].name;

    $("#getPokemonRand").append(
      $(`<div class="pokemonInfo"><span class="pokemonImg">
            <img src=${imgSrc} width="100" height="100">
            </span>
            <span class="pokemonId">${pokeIdandName}
            </span>
            </div>
          `)
    );
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

/**
 * With given pokemon id, and return pokemon name
 * @param {*} id
 */
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
      pokemonList.sort((a, b) => a.id - b.id);
    })
    .catch((err) => {
      console.log("Bad Request", error);
    });
}

function getPokemoTeamRandom() {
  while (true) {
    let intRand;
    intRand = Math.floor(Math.random() * 151) + 1;
    if (groupPokemonRandomId.length >= 6) {
      break;
    } else {
      if (groupPokemonRandomId.includes(intRand)) {
        continue;
      } else {
        groupPokemonRandomId.push(intRand);
      }
    }
  }
}
