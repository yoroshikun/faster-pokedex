import { StatsRadar } from "@/components/StatsRadar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PokemonSprite from "@/lib/pokemon-sprite";
import { getPokemon, Pokemon } from "@/sdk/pokeapi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const experimental_ppr = true;

async function Pokedex() {
  const currentPokemonJSON = (await cookies()).get("currentPokemon")?.value;
  const currentPokemon = currentPokemonJSON
    ? (JSON.parse(currentPokemonJSON) as Pokemon)
    : await getPokemon(0);

  const nextPokemon = await getPokemon(currentPokemon.dexNumber);
  const previousPokemon = await getPokemon(currentPokemon.dexNumber - 2);

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Render next two images in hidden divs so they load faster */}
      {nextPokemon && (
        <div className="hidden">
          <PokemonSprite
            key={nextPokemon.dexNumber}
            pokemon={nextPokemon}
            className="w-64 h-64"
          />
        </div>
      )}
      {previousPokemon && (
        <div className="hidden">
          <PokemonSprite
            key={previousPokemon.dexNumber}
            pokemon={previousPokemon}
            className="w-64 h-64"
          />
        </div>
      )}
      <Card className="w-80 p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl capitalize">
            {currentPokemon.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <PokemonSprite
            pokemon={currentPokemon}
            className="w-64 h-64 border rounded-lg bg-gray-50"
          />
          <StatsRadar data={currentPokemon.stats} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <form>
            {previousPokemon && (
              <Button
                formAction={async () => {
                  "use server";
                  const jar = await cookies();
                  jar.set("currentPokemon", JSON.stringify(previousPokemon));
                }}
              >
                <ChevronLeft />
              </Button>
            )}

            {nextPokemon && (
              <Button
                formAction={async () => {
                  "use server";
                  const jar = await cookies();
                  jar.set("currentPokemon", JSON.stringify(nextPokemon));
                }}
              >
                <ChevronRight />
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Pokedex />
      </Suspense>
    </div>
  );
}
