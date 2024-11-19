"use client";

import { Pokemon } from "@/sdk/pokeapi";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

export const CookieSync = ({
  pokemonId,
}: {
  pokemonId: Pokemon["dexNumber"];
}) => {
  const [id, setId] = useQueryState("id", parseAsInteger.withDefault(0));

  useEffect(() => {
    if (id !== pokemonId) {
      setId(pokemonId);
    }
  }, [id, setId, pokemonId]);

  return null;
};
