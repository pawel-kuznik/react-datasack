import { CollectionPotential, Entry } from "@pawel-kuznik/datasack";
import { useContext, useState } from "react";
import { PromiseContext } from "./PotentialSuspense";
import { useEventCallback } from "@pawel-kuznik/react-on-ivents";

export function usePotentialCollection<TEntry extends Entry>(collection: CollectionPotential<TEntry>) : TEntry[] {

    const [ , setLastUpdate ] = useState<number>(() => new Date().getTime()); 
    useEventCallback(collection, "update", () => {
        setLastUpdate(new Date().getTime());
    });
    return useContext(PromiseContext).getResult(collection);
};