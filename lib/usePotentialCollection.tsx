import { CollectionPotential, Entry } from "@pawel-kuznik/datasack";
import { useContext, useState } from "react";
import { PromiseContext } from "./PotentialSuspense";
import { useEventCallback } from "@pawel-kuznik/react-on-ivents";

/**
 *  A hook that gives access to a collection from a collection potential.
 *  While the hook is waiting for the collection to be loaded, it will throw
 *  a promise. The promise should be caught by the PotentialSuspense component.
 */
export function usePotentialCollection<TEntry extends Entry>(collection: CollectionPotential<TEntry>) : TEntry[] {

    const [ , setLastUpdate ] = useState<number>(() => new Date().getTime()); 
    useEventCallback(collection, "update", () => {
        setLastUpdate(new Date().getTime());
    });
    return useContext(PromiseContext).getResult(collection);
};