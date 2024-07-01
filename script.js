const pokeContainer = document.querySelector(".pokeContainer");
const typeSelect = document.getElementById("typeSelect");
const modal = document.getElementById("pokemonModal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalTypes = document.getElementById("modal-types");
const modalStats = document.getElementById("modal-stats");
const closeModalButton = document.querySelector(".close");

const pokeCount = 1000;
const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

const mainTypes = Object.keys(colors);

const fetchPokes = async () => {
  for (let i = 1; i <= pokeCount; i++) {
    await getPokes(i);
  }
};

const getPokes = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const resp = await fetch(url);
  const data = await resp.json();
  createPokeCard(data);
};

const createPokeCard = (poke) => {
  const card = document.createElement("div");
  card.classList.add("pokemon");
  card.setAttribute("data-id", poke.id);

  const name = poke.name[0].toUpperCase() + poke.name.slice(1);
  const id = poke.id.toString().padStart(3, "0");
  const pokeTypes = poke.types.map((type) => type.type.name);
  const type = mainTypes.find((type) => pokeTypes.indexOf(type) > -1);
  const color = colors[type];

  const typesHTML = pokeTypes.map((type) => `<span>${type}</span>`).join(", ");

  card.style.backgroundColor = color;

  const pokeInnerHTML = `<div class="imgContainer">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
    </div>
    <div class="infos">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small>Type: <span class="type">${typesHTML}</span></small>
    </div>`;

  card.innerHTML = pokeInnerHTML;

  pokeContainer.append(card);

  card.addEventListener("click", () => openModal(poke));
};

const openModal = (poke) => {
  const mainType = poke.types[0].type.name;
  const color = colors[mainType];

  const modalContent = document.querySelector(".modal-content");
  modalContent.style.backgroundColor = color;

  modalImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
  modalName.textContent = poke.name[0].toUpperCase() + poke.name.slice(1);

  modalTypes.innerHTML = poke.types
    .map(
      (type) =>
        `<span style="background-color: rgba(0, 0, 0, 0.1);">${
          type.type.name
        }</span>`
    )
    .join(", ");

  const statBars = poke.stats
    .map((stat) => {
      const statName = stat.stat.name.replace("special-", "sp-");
      return `
          <div class="stat-bar ${statName}">
              <span>${statName.toUpperCase()}:</span>
              <div class="bar" style="width: ${stat.base_stat * 2}px;"></div>
              <span class="value_stats">${stat.base_stat}</span>
          </div>
      `;
    })
    .join("");

  modalStats.innerHTML = statBars;

  modal.style.display = "flex";
};

closeModalButton.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

fetchPokes();

typeSelect.addEventListener("change", (event) => {
  const selectedType = event.target.value;
  filterPokemon(selectedType);
});

const filterPokemon = (type) => {
  const allPokemons = document.querySelectorAll(".pokemon");
  allPokemons.forEach((pokemon) => {
    const pokeTypes = pokemon.querySelector(".type").innerText.toLowerCase();
    if (type === "all" || pokeTypes.includes(type)) {
      pokemon.style.display = "block";
    } else {
      pokemon.style.display = "none";
    }
  });
};
