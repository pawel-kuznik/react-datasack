import { Sack, Entry, MemoryDriver } from "@pawel-kuznik/datasack";
import { describe, test } from "vitest";
import { usePotentialEntry } from "./usePotentialEntry";
import { renderHook, waitFor} from "@testing-library/react"
import { PotentialSuspense } from "./PotentialSuspense";

describe("usePotentialEntry", () => {

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

        const potential = sack.getEntryPotential("test")
        
        const { result } = renderHook(() => usePotentialEntry(potential), {
            wrapper: ({ children }) => <PotentialSuspense>
                {children}
            </PotentialSuspense>
        });

        await waitFor(() => {
            expect(result.current).toBeDefined();
            expect(result.current.id).toBe("test");
            expect(result.current.name).toBe("Test");
        })
    })
})