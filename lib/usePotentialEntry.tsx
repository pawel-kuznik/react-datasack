import { Entry, EntryPotential } from "@pawel-kuznik/datasack";
import { useEventCallback } from "@pawel-kuznik/react-on-ivents";
import { useContext, useState } from "react";
import { PromiseContext } from "./PotentialSuspense";

/**
 *  A hook that gives access to an entry from an entry potential.
 *  While the hook is waiting for the entry to be loaded, it will throw
 *  a promise. The promise should be caught by the PotentialSuspense component.
 */
export function usePotentialEntry<TEntry extends Entry>(entity: EntryPotential<TEntry>): TEntry {

    const [ , setLastUpdate ] = useState<number>(() => new Date().getTime());
    useEventCallback(entity, "update", () => {
        setLastUpdate(new Date().getTime());
    });
    
    return useContext(PromiseContext).getResult(entity);
};
