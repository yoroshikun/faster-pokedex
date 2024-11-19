import "server-only";
import { unstable_cacheLife } from "next/cache";

export type Pokemon = {
  name: string;
  dexNumber: number;
  types: [string, string];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
};

/**
 * Fetches all Pokemon from Gen 1-9 (up to #1025) from the PokeAPI GraphQL endpoint.
 * Each Pokemon includes their name, Pokedex number, type and stats.
 * Results are cached indefinitely using Next.js cache.
 */
export async function getAllPokemon() {
  "use cache";
  unstable_cacheLife("forever");

  const query = `
    query GetAllPokemon {
      pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
        id
        pokemon_v2_pokemonspecy {
          name
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
            id
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
      }
    }
  `;

  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = (await response.json()).data as {
    pokemon_v2_pokemon: {
      id: number;
      pokemon_v2_pokemonspecy: {
        name: string;
      };
      pokemon_v2_pokemontypes: {
        pokemon_v2_type: {
          name: string;
          id: number;
        };
      }[];
      pokemon_v2_pokemonstats: {
        base_stat: number;
        pokemon_v2_stat: {
          name: string;
        };
      }[];
    }[];
  };

  return data.pokemon_v2_pokemon.map((pokemon) => ({
    name: pokemon.pokemon_v2_pokemonspecy.name,
    dexNumber: pokemon.id,
    types: pokemon.pokemon_v2_pokemontypes.map(
      (type) => type.pokemon_v2_type.name,
    ) as [string, string],
    stats: pokemon.pokemon_v2_pokemonstats.reduce(
      (acc, stat) => ({
        ...acc,
        [stat.pokemon_v2_stat.name]: stat.base_stat,
      }),
      {} as Pokemon["stats"],
    ),
  }));
}

// import { connection } from "next/server";

export async function getPokemon(index: number) {
  const allPokemon = await getAllPokemon();
  return allPokemon[index];
}

// export async function getTwoRandomPokemon() {
//   await connection(); // Next needed some help knowing this is dynamic

//   const allPokemon = await getAllPokemon();
//   const shuffled = allPokemon.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, 2);
// }
