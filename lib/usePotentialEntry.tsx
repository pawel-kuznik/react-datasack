import { Entry, EntryPotential } from "@pawel-kuznik/datasack";
import { useEventCallback } from "@pawel-kuznik/react-on-ivents";
import { useContext, useState } from "react";
import { PromiseContext } from "./PotentialSuspense";

export function usePotentialEntry<TEntry extends Entry>(entity: EntryPotential<TEntry>): TEntry {

    const [ , setLastUpdate ] = useState<number>(() => new Date().getTime());
    useEventCallback(entity, "update", () => {
        setLastUpdate(new Date().getTime());
    });
    
    return useContext(PromiseContext).getResult(entity);
};
