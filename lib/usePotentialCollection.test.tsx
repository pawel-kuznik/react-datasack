import { Sack, Entry, MemoryDriver } from "@pawel-kuznik/datasack";
import { describe, test } from "vitest";
import { renderHook, waitFor} from "@testing-library/react"
import { PotentialSuspense } from "./PotentialSuspense";
import { usePotentialCollection } from "./usePotentialCollection";

describe("usePotentialCollection", () => {

    interface TestEntry extends Entry {
        name: string;
    }

    test("should present an entry", async () => {

        const driver = new MemoryDriver<TestEntry>();
        const sack = new Sack(driver);

        await sack.insert({
            id: "test",
            name: "Test"
        });

        const potential = sack.getCollectionPotential()
        
        const { result } = renderHook(() => usePotentialCollection(potential), {
            wrapper: ({ children }) => <PotentialSuspense>
                {children}
            </PotentialSuspense>
        });

        await waitFor(() => {

            const collection = result.current;

            expect(collection).toHaveLength(1);
            expect(collection[0].id).toBe("test");
            expect(collection[0].name).toBe("Test");
        })
    })
})