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

const Skeleton = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-80 p-4 border rounded-lg bg-gray-100">
      <div className="text-center text-2xl capitalize h-8 bg-gray-300 rounded w-2/3 mx-auto mb-4 animate-pulse" />
      <div className="flex flex-col items-center gap-4">
        <div className="w-64 h-64 border rounded-lg bg-gray-200 animate-pulse" />
        <div className="w-full h-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<Skeleton />}>
        <Pokedex />
      </Suspense>
    </div>
  );
}
