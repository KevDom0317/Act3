document.addEventListener("DOMContentLoaded", () => {
    const pokemonImg = document.getElementById('pokemon-img');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonNumber = document.getElementById('pokemon-number');
    const hp = document.getElementById('hp');
    const attack = document.getElementById('attack');
    const defense = document.getElementById('defense');
    const spAttack = document.getElementById('sp-attack');
    const spDefense = document.getElementById('sp-defense');
    const speed = document.getElementById('speed');
    const type1 = document.getElementById('type1');
    const type2 = document.getElementById('type2');
    const shinyBtn = document.getElementById('shiny-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const bulbasaurImg = document.getElementById('bulbasaur');
    const ivysaurImg = document.getElementById('ivysaur');
    const venusaurImg = document.getElementById('venusaur');
    
    let currentPokemon;

    const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

    function fetchPokemon(idOrName) {
        fetch(`${apiUrl}${idOrName}`)
            .then(response => response.json())
            .then(data => {
                currentPokemon = data;
                console.log(data);
                pokemonImg.src = data.sprites.front_default;
                pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                pokemonNumber.textContent = `No. ${data.id}`;
                hp.textContent = data.stats[0].base_stat;
                attack.textContent = data.stats[1].base_stat;
                defense.textContent = data.stats[2].base_stat;
                spAttack.textContent = data.stats[3].base_stat;
                spDefense.textContent = data.stats[4].base_stat;
                speed.textContent = data.stats[5].base_stat;
                type1.textContent = data.types[0].type.name;
                type1.style.backgroundColor = getTypeColor(data.types[0].type.name);
                if (data.types[1]) {
                    type2.style.display = 'inline-block';
                    type2.textContent = data.types[1].type.name;
                    type2.style.backgroundColor = getTypeColor(data.types[1].type.name);
                } else {
                    type2.style.display = 'none';
                }
                fetchEvolutionChain(data.species.url);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchEvolutionChain(speciesUrl) {
        fetch(speciesUrl)
            .then(response => response.json())
            .then(speciesData => {
                return fetch(speciesData.evolution_chain.url);
            })
            .then(response => response.json())
            .then(evolutionData => {
                displayEvolutions(evolutionData.chain);
            })
            .catch(error => console.error('Error:', error));
    }

    async function displayEvolutions(chain) {
        let evolutions = [chain.species.name];
        let currentChain = chain;
        while (currentChain.evolves_to.length > 0) {
            currentChain = currentChain.evolves_to[0];
            evolutions.push(currentChain.species.name);
        }

        bulbasaurImg.src = evolutions[0] ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${await getPokemonId(evolutions[0])}.png` : '';
        ivysaurImg.src = evolutions[1] ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${await getPokemonId(evolutions[1])}.png` : '';
        venusaurImg.src = evolutions[2] ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${await getPokemonId(evolutions[2])}.png` : '';
    }

    async function getPokemonId(name) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        return data.id;
    }

    function getTypeColor(type) {
        const colors = {
            grass: 'green',
            poison: 'purple',
            fire: 'red',
            water: 'blue',
            bug: 'lime',
            normal: 'grey',
            flying: 'skyblue',
            electric: 'yellow',
            ground: 'brown',
            rock: 'darkgrey',
            psychic: 'pink',
            ice: 'lightblue',
            dragon: 'orange',
            dark: 'black',
            steel: 'silver',
            fairy: 'lightpink'
        };
        return colors[type] || 'white';
    }

    shinyBtn.addEventListener('click', () => {
        if (currentPokemon) {
            const currentSrc = pokemonImg.src;
            if (currentSrc.includes('shiny')) {
                pokemonImg.src = currentPokemon.sprites.front_default;
            } else {
                pokemonImg.src = currentPokemon.sprites.front_shiny;
            }
        }
    });

    searchBtn.addEventListener('click', () => {
        const searchQuery = searchInput.value.toLowerCase();
        if (searchQuery) {
            fetchPokemon(searchQuery);
        }
    });

    fetchPokemon(2); // Fetch Ivysaur by default
});
