import * as React from "react";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { AtSign, BookUser, Search, UserRound, Users2, Clock, X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import { useTheme } from 'next-themes';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    teamName?: string;
    userImage?: string;
}

export interface Team {
    teamID: string;
    teamName: string;
    createdBy: string;
    team_picture?: string;
}

const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, (match) => `<span class="text-blue-600 dark:text-blue-400 font-semibold text-xs">${match}</span>`);
};

const useDebouncedValue = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<(User | Team)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<User | Team | null>(null);
    const [filterTag, setFilterTag] = useState<string>('email');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const resultsRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { theme, setTheme } = useTheme();

    const debouncedQuery = useDebouncedValue(query, 300);

    const cache = new Map<string, (User | Team)[]>();

    const fetchResults = useCallback(async () => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            return;
        }

        const queryWithTag = `${filterTag}/${debouncedQuery}`;

        if (cache.has(queryWithTag)) {
            setResults(cache.get(queryWithTag)!);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(queryWithTag)}&filter=${filterTag}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: (User | Team) [] = await response.json();
            cache.set(queryWithTag, data);
            setResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to fetch search results');
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, filterTag]);

    useEffect(() => {
        fetchResults();
    }, [debouncedQuery, filterTag, fetchResults]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setOpen(true);
        setFocusedIndex(-1);
    };

    const handleTagChange = (tag: string) => {
        setFilterTag(tag);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            e.preventDefault();
            const selectedItem = results[focusedIndex];
            handleItemSelect(selectedItem);
        }
    };

    useEffect(() => {
        if (resultsRef.current && focusedIndex >= 0) {
            const focusedElement = resultsRef.current.children[focusedIndex] as HTMLElement;
            focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [focusedIndex]);

    const handleItemSelect = (item: User | Team) => {
        setSelectedItem(item);
        setOpen(false);
        setSearchHistory(prev => [query, ...prev.slice(0, 7)]);
    };


    return (
        <div className="status-selector w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-[150px] justify-start"
                        onClick={() => setOpen(true)}
                    >
                        <><Search className="h-4 w-4 mr-2" /><span className="font-light text-[12px]">Search...</span></>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[calc(100vw-2rem)] sm:w-[600px] max-w-[600px]" side="bottom" align="start">
                    <div className="flex flex-col p-4">
                        <div className="search-bar text-xs w-full relative ">
                            <Input
                                type="search"
                                value={query}
                                onChange={handleQueryChange}
                                onKeyDown={handleKeyDown}
                                placeholder={`Search items by select tags... (e.g. ${filterTag}/items)`}
                                className="search-input w-full p-2 pr-8 border rounded text-xs "
                                ref={inputRef}
                            />
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            {results.length > 0 && (
                                <ul ref={resultsRef} className="search-results mt-2 max-h-[200px] overflow-y-auto">
                                    {results.map((item, index) => (
                                        <li
                                            key={(item as User).email || (item as Team).teamID}
                                            className={`cursor-pointer hover:bg-muted/60 p-2 flex items-center space-x-4 ${
                                                index === focusedIndex ? 'bg-blue-100 dark:bg-blue-900' : ''
                                            }`}
                                            onClick={() => handleItemSelect(item)}
                                        >
                                            {(item as User).email ? (
                                                <>
                                                    <Avatar className='h-8 w-8'>
                                                        {(item as User).userImage ? (
                                                            <AvatarImage src={(item as User).userImage} alt={(item as User).firstName} />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {(item as User).firstName[0]}{(item as User).lastName[0]}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex flex-col rounded">
                                                        <span className="font-light text-[12px]" dangerouslySetInnerHTML={{ __html: highlightMatch((item as User).firstName || '', debouncedQuery) }} />
                                                        <span className="font-light text-[12px]" dangerouslySetInnerHTML={{ __html: highlightMatch((item as User).lastName || '', debouncedQuery) }} />
                                                        <span className="font-light text-[12px]" dangerouslySetInnerHTML={{ __html: highlightMatch((item as User).email || '', debouncedQuery) }} />
                                                        <span className="font-light text-[12px]" dangerouslySetInnerHTML={{ __html: highlightMatch((item as User).teamName || '', debouncedQuery) }} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Avatar className='h-8 w-8'>
                                                        {(item as Team).team_picture ? (
                                                            <AvatarImage src={(item as Team).team_picture} alt={(item as Team).teamName} />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {(item as Team).teamName[0]}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex flex-col rounded">
                                                        <span className="font-light text-[12px]" dangerouslySetInnerHTML={{ __html: highlightMatch((item as Team).teamName || '', debouncedQuery) }} />
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!loading && results.length === 0 && debouncedQuery.length >= 2 && (
                                <p className="text-gray-500 mt-2">No results found</p>
                            )}
                            {searchHistory.length > 0 && !query && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Recent Searches</h3>
                                    <ul>
                                        {searchHistory.map((search, index) => (
                                            <li
                                                key={index}
                                                className="cursor-pointer hover:bg-muted/60 p-2 flex items-center "
                                                onClick={() => setQuery(search)}
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>{search}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <span className="font-semibold">Tags</span>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['email', 'firstname', 'lastname', 'teamName', 'teams'].map((tag, index) => (
                                    <button
                                        key={index}
                                        className="text-xs text-blue-500 p-2 hover:bg-muted/40 rounded"
                                        onClick={() => handleTagChange(tag)}
                                    >
                                        <Card className="w-full">
                                            <CardHeader className="text-start text-blue-500 flex items-center">
                                                {tag === 'email' && <AtSign className="h-4 w-4 mr-2"/>}
                                                {tag === 'firstname' && <UserRound className="h-4 w-4 mr-2"/>}
                                                {tag === 'lastname' && <BookUser className="h-4 w-4 mr-2"/>}
                                                {tag === 'teamName' && <Users2 className="h-4 w-4 mr-2"/>}
                                                {tag === 'teams' && <Users2 className="h-4 w-4 mr-2"/>}
                                                /{tag}
                                            </CardHeader>
                                            <CardFooter></CardFooter>
                                        </Card>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SearchBar;