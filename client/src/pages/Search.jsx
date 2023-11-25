/* eslint-disable react-hooks/exhaustive-deps */
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getSearchTermFeed } from "../utils/http";
import { Link, useLocation, useParams } from "react-router-dom";
import FeedCard from "../components/FeedCard";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";

const Search = () => {
  let location = useLocation();
  const [searchTermURL, setSearchTerm] = useState(
    new URLSearchParams(location.search).toString()
  );

  useEffect(() => {
    const searchTermFromUrl = new URLSearchParams(location.search);
    setSearchTerm(searchTermFromUrl.toString());
  }, [location]);

  const {
    data: feeds,
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: commentError,
  } = useInfiniteQuery({
    queryKey: ["feeds", searchTermURL],
    queryFn: ({ pageParam = 1, queryKey }) =>
      getSearchTermFeed({ searchTerm: queryKey[1], pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length === 9 ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  return (
    <div className='max-w-lg flex flex-col my-16 mx-auto gap-2 p-2'>
      {status === "pending" && (
        <div className='flex justify-center'>
          <TailSpin
            height='80'
            width='80'
            color='black'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
      {status === "success" && (
        <>
          {feeds.pages[0].length === 0 ? (
            <div className='justify-center flex flex-col gap-2'>
              <span className='text-lg font-medium text-gray-500 mt-5 mx-auto self-center'>
                No feeds to show create new to see!!
              </span>

              <Link to='/create-feed'>
                <button className='p-2 bg-slate-600 w-full rounded-lg text-white mb-2 uppercase hover:opacity-95'>
                  Create New Feed
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <h1 className='text-3xl mb-8 font-bold text-center'>Feeds</h1>
              {feeds.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.map((feed) => (
                    <Link
                      to={`/feed/${feed._id}`}
                      key={feed._id}
                    >
                      <FeedCard
                        feed={feed}
                        search={true}
                      />
                    </Link>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <div className='flex justify-center m-1'>
              <span
                className='text-green-700 cursor-pointer hover:opacity-90'
                onClick={() => fetchNextPage()}
              >
                Show more
              </span>
            </div>
          )}
          {isFetchingNextPage && (
            <div className='mt-4 flex justify-center'>
              <TailSpin
                height='20'
                width='20'
                color='black'
                ariaLabel='tail-spin-loading'
                radius='1'
                wrapperStyle={{}}
                wrapperClass=''
                visible={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
