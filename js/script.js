let viewAllPokemon;
let imgSrc;
let pokeIdandName;
let addTeamMember;
let removePokemonId;

//pokemonArray with pokemon as obj
const pokemonList = [];
// pokemonId Array grouped by random
const pokemonRandomId = [];
// Pokemon Array with user's click
const myPokemonList = [];

//docuemnt ready and build allPokemonList
$(document).ready(function () {
  for (let i = 1; i <= 151; i++) {
    getPokemonNameById(i);
  }
  //sort pokemonList
  pokemonList.sort((a, b) => a.id - b.id);
});

//viewAllPokemonList
$("#getAllPokemon").click(function () {
  idInput = prompt("Please Key the ID range you want to view?(1-151)");
  idInputList = idInput.split("-");
  //modify header
  $("#viewAllPokemonHead").text(
    `Here are Pokemons from ID:${idInputList[0]}-${idInputList[1]}`
  );
  //refrsh viewAllPokemon
  $("#viewAllPokemon").text("");
  //load Pokemons to the DOM based on input
  for (let i = idInputList[0]; i <= idInputList[1]; i++) {
    //retrieve Pokemon's photo and id
    imgSrc = pokemonList[i - 1].sprites.other["official-artwork"].front_default;
    pokeIdandName = "#" + pokemonList[i - 1].id + " " + pokemonList[i - 1].name;
    //created a jQuery obj and appendTo the div with #viewAllPokemon
    $("#viewAllPokemon").append(
      $(`<div class="pokemonInfo"><span class="pokemonImg">
            <img src=${imgSrc} width="125" height="125">
            </span>
            <span class="pokemonId">${pokeIdandName}
            <button id="addTeam">+</button>
            </span>
            </div>
          `)
    );
  }
});

//hide and show searched pokemonList
$("#hideAllPokemon").click(function (evt) {
  $("#viewAllPokemon").toggle();
  if (evt.target.textContent == "HIDE") {
    evt.target.textContent = "SHOW";
  } else evt.target.textContent = "HIDE";
});

//delete searched pokemon List
$("#removeAllPokemon").click(function () {
  $("#viewAllPokemon").text("");
  $("#viewAllPokemonHead").text(`Here are Pokemon List:`);
});

//click and randomly get pokemonList
$("#getPokemonListByRandom").click(function () {
  //remove PokemonId in the existing array
  pokemonRandomId.splice(0, pokemonRandomId.length);
  //get PokemonId and sort it
  getPokemoTeamRandom();
  pokemonRandomId.sort(function (a, b) {
    return a - b;
  });
  //clean pokemonRand DOM
  $("#getPokemonRand").text("");
  //put pokemons into DOM based on array of Id and destination tag
  putPokemonToDOM(pokemonRandomId, "#getPokemonRand");
});

//addTeam by clicking button
$("div#viewAllPokemon").on("click", "#addTeam", function (evt) {
  if (myPokemonList.length < 6) {
    addTeamMember = $(evt.target.parentElement.parentElement).clone();
    //modifed btn: + -> x and color(class)
    addTox = addTeamMember[0].children[1].innerHTML.replace("+", "x");
    $(addTeamMember[0].children[1]).html(addTox);
    $(addTeamMember[0].children[1].children).attr("id", "remove");
    //getPokemonID
    chosenPokemonID = evt.target.parentElement.textContent
      .split(" ")[0]
      .substring(1);
    //pokemon has been chosen, not able to joined again.
    if (myPokemonList.includes(chosenPokemonID) == false) {
      myPokemonList.push(chosenPokemonID);
      $(addTeamMember).appendTo($("#getMyTeam"));
      $($("h4#myTeam")[0]).html(`My Pokemon Team: ${myPokemonList.length}`);

      $(evt.target.parentElement.parentElement).addClass("circle");
    } else
      alert(`${pokemonList[chosenPokemonID - 1].name} has joined the team!`);
  } else alert("You have choosen six pokemon in the team!");
});

// remove Pokemon from myTeam
$("div#getMyTeam").on("click", "#remove", function (evt) {
  //remove Pokemon from the team
  $(evt.target.parentElement.parentElement).fadeOut();
  //get remove PokemonId
  removePokemonId = evt.target.parentElement.innerHTML
    .split(" ")[0]
    .substring(1);
  let index = myPokemonList.indexOf(removePokemonId);
  myPokemonList.splice(index, 1);
  $($("h4#myTeam")[0]).text(`My Pokemon Team: ${myPokemonList.length}`);
  //remove circle class
  removeCircle(removePokemonId);
});

//deterine if meet the requirement of a fight!
$("#readyToFight").click(readyFight);

/**
 * With given removePokemonId, and find this Pokemon in the viewAllPokemon DOM
 * remove its class of circle
 * @param {number} removePokemonId
 */
function removeCircle(removePokemonId) {
  //iterater all the childNodes, find the one's id equals to removePokemonId
  //remove its class
  for (let pokemonInfo of $("div#viewAllPokemon")[0].childNodes) {
    if (
      pokemonInfo.children[1].innerHTML.split(" ")[0].substring(1) ===
      removePokemonId
    ) {
      pokemonInfo.classList.remove("circle");
    }
  }
}

/**
 * With given pokemon id, get Pokemon's name.
 * With Pokemon's name, getPokemonList
 * @param {number} id
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
/**
 * With given Pokemon's name, to fetch Pokemon's photo
 * Store Pokemon's as a obj in the array
 * @param {string} currentPokemonName
 */
function getPokemonList(currentPokemonName) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${currentPokemonName}/`,
  })
    .then((pokemon) => {
      //push pokemon as obj into pokemonList(Array)
      pokemonList.push(pokemon);
    })
    .catch((err) => {
      console.log("Bad Request", error);
    });
}

/**
 * Get a 6-number random array from (1-151), inclusive and no repeated
 * The array was used to store the random PokemonId of the computer
 */
function getPokemoTeamRandom() {
  while (true) {
    let intRand;
    intRand = Math.floor(Math.random() * 151) + 1;
    if (pokemonRandomId.length >= 6) {
      break;
    } else {
      if (pokemonRandomId.includes(intRand)) {
        continue;
      } else {
        pokemonRandomId.push(intRand);
      }
    }
  }
}

/**
 * Put pokemon info to the DOM based on given pokemonList and TagId where location
 * @param {array} pokemonIdList
 * @param {string} putTagID
 */
function putPokemonToDOM(pokemonIdList, putTagID) {
  for (let pokemonId of pokemonIdList) {
    imgSrc =
      pokemonList[pokemonId - 1].sprites.other["official-artwork"]
        .front_default;
    pokeIdandName =
      "#" +
      pokemonList[pokemonId - 1].id +
      "  " +
      pokemonList[pokemonId - 1].name;

    $(putTagID).append(
      $(`<div class="pokemonInfo"><span class="pokemonImg">
            <img src=${imgSrc} width="100%" height="100%">
            </span>
            <span class="pokemonId">${pokeIdandName}
            </span>
            </div>
          `)
    );
  }
}

/**
 * As computer team and player's team are ready.
 * alert next step of this game
 */
function readyFight() {
  if (myPokemonList.length == 6 && pokemonRandomId.length == 6) {
    alert("Please wait for the updates!!");
  } else alert("Please build up computer's team or your team!");
}
