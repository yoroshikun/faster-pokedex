"use client";

import { revalidatePath } from "next/cache";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "./ui/button";

export const Buttons = () => {
  const [id, setId] = useQueryState("id", parseAsInteger.withDefault(0));

  return (
    <>
      <Button
        onClick={() => {
          setId(id + 1);
          revalidatePath("/");
        }}
      />
      <Button onClick={() => setId(id - 1)} />
    </>
  );
};
