"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
const UserSearchBar = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    // I am gonig to use deboune here to stop hammering the server with each key stroke !!!
    const [debouncedQuery] = useDebounce(query, 200);
    useEffect(() => {
        if (!debouncedQuery) {
            router.push(`/search`) 
        } else {
            router.push(`/search?=${debouncedQuery}`)
        }
    }, [debouncedQuery, router])

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <p className='text-light-500'>yah, I like it, man</p>
        </div>
    );
};

export default UserSearchBar;
