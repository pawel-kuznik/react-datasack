import { CollectionPotential, Entry, EntryPotential } from "@pawel-kuznik/datasack";
import { ReactNode, Suspense, createContext, useCallback, useEffect, useMemo, useState } from "react";

interface GetResultType {
    <TEntry extends Entry>(entry: EntryPotential<TEntry>): TEntry;
    <TEntry extends Entry>(collection: CollectionPotential<TEntry>) : TEntry[];
}

interface PromiseContextData {
    getResult: GetResultType
};

class CollectionRegistry {

    private _promises: Map<CollectionPotential<any>, Promise<any>> = new Map();
    private _data: WeakMap<CollectionPotential<any>, any> = new WeakMap();

    get promisesSize() { return this._promises.size; }

    getResult(collection: CollectionPotential<any>) : any[] {

        const result = this._data.get(collection);

        // @todo what if the result is false-like? (0, null, or "")
        if (result) return result;

        let promise = this._promises.get(collection);
        if (promise) throw promise;

        const processedPromise = collection.all().then(v => {
            this._data.set(collection, v);
        });

        this._promises.set(collection, processedPromise);

        // @todo where this is uninstalled? hint: nowhere
        collection.on("update", () => {

            this._promises.delete(collection);
            this._data.delete(collection);
            const promise = collection.all().then(v => {
                this._data.set(collection, v);
            });
            this._promises.set(collection, promise);
        });

        throw processedPromise;
    }

    clear() {
        this._promises.clear();
    }
};

class EntryRegistry {

    private _promises: Map<EntryPotential<any>, Promise<any>> = new Map();
    private _data: WeakMap<EntryPotential<any>, any> = new WeakMap();

    get promisesSize() { return this._promises.size; }

    getResult(entry: EntryPotential<any>) : any {

        const result = this._data.get(entry);

        // @todo what if the result is false-like? (0, null, or "")
        if (result) return result;

        const promise = this._promises.get(entry);
        if (promise) throw promise;

        const processedPromise = entry.fetch().then(v => {
            this._data.set(entry, v);
        });

        this._promises.set(entry, processedPromise);
        
        // @todo where this is uninstalled? hint: nowhere
        entry.on("update", () => {

            this._promises.delete(entry);
            this._data.delete(entry);
            const promise = entry.fetch().then(v => {
                this._data.set(entry, v);
            });
            this._promises.set(entry, promise);
        });

        throw processedPromise;
    }

    clear() {
        this._promises.clear();
    }
};

export const PromiseContext = createContext<PromiseContextData>({
    getResult: () => {
        throw Error("usePotentialCollection called outside PotentialSuspense");
    }
});

export interface PotentialSuspenseProps {
    fallback?: ReactNode;
    children?: ReactNode;
};

export function PotentialSuspense({ fallback, children }: PotentialSuspenseProps) {

    const [ collectionData ] = useState<CollectionRegistry>(() => new CollectionRegistry());
    const [ entryData ] = useState<EntryRegistry>(() => new EntryRegistry());

    useEffect(() => () => {

        collectionData.clear();
        entryData.clear();

    }, [ collectionData, entryData ]);

    const getCollectionResult = useCallback((collection: CollectionPotential<any>) => collectionData.getResult(collection), [ collectionData ]);
    const getEntryResult = useCallback((entry: EntryPotential<any>) => entryData.getResult(entry), [ entryData ]);

    const data = useMemo(() => {
        return {
            getResult: (target: CollectionPotential<any>|EntryPotential<any>) => {
                if ('all' in target) return getCollectionResult(target);
                else return getEntryResult(target);
            }
        };
    }, [ entryData, collectionData ]);

    return (
        <PromiseContext.Provider value={data}>
            <Suspense fallback={fallback}>
                {children}
            </Suspense>
        </PromiseContext.Provider>
    );
};