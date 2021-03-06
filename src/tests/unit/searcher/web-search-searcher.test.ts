import { SearchResultItem } from "../../../ts/search-result-item";
import { WebSearchSearcher } from "../../../ts/searcher/web-search-searcher";
import { InputOutputCombination, dummyWebSearches } from "../test-helpers";
import { WebSearchHelpers } from "../../../ts/helpers/web-search-helper";

describe(WebSearchSearcher.name, (): void => {
    const webSearches = dummyWebSearches;
    const searcher = new WebSearchSearcher(webSearches);

    describe(searcher.getSearchResult.name, (): void => {
        for (const webSearch of webSearches) {
            it(`${webSearch.name} web search should return a correct search result`, (): void => {
                const combinations: InputOutputCombination[] = [
                    {
                        input: `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}google-some-thing`,
                        output: {
                            executionArgument: `${webSearch.url}google-some-thing`,
                            name: `Search ${webSearch.name} for 'google-some-thing'`,
                        } as SearchResultItem,
                    },
                    {
                        input: `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`,
                        output: {
                            executionArgument: `${webSearch.url}`,
                            name: `Search ${webSearch.name}`,
                        } as SearchResultItem,
                    },
                ];

                for (const combination of combinations) {
                    const actual = searcher.getSearchResult(combination.input);
                    expect(actual.filter.length).toBe(1);
                    expect(actual[0].name).toBe(combination.output.name);
                    expect(actual[0].executionArgument).toBe(combination.output.executionArgument);
                }
            });

            it("should throw an error if user input does not match any search engine", (): void => {
                const invalidUserInputs = [
                    "",
                    "   ",
                    "x?",
                    "gugus",
                ];

                let errorCounter = 0;

                for (const invalidUserInput of invalidUserInputs) {
                    try {
                        searcher.getSearchResult(invalidUserInput);
                    } catch (error) {
                        errorCounter++;
                    }
                }

                expect(errorCounter).toBe(invalidUserInputs.length);
            });

            it("should trim the user's search term", (): void => {
                const userSearchTerms = [
                    "hallo",
                    " hallo ",
                    "      hallo",
                    "hallo     ",
                ];

                const trimmedUserInput = "hallo";

                for (const dummyWebSearch of dummyWebSearches) {
                    for (const userSearchTerm of userSearchTerms) {
                        const userInput = `${dummyWebSearch.prefix}${WebSearchHelpers.webSearchSeparator}${userSearchTerm}`;
                        const actual = searcher.getSearchResult(userInput);

                        expect(actual.length).toBe(1);
                        expect(actual[0].executionArgument).toBe(`${dummyWebSearch.url}${trimmedUserInput}`);
                    }
                }
            });
        }
    });

    it("should block other searchers", (): void => {
        const actual = searcher.blockOthers;
        expect(actual).toBe(true);
    });
});
