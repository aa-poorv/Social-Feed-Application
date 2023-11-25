import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { getFeed } from "../utils/http";
import FeedCard from "../components/FeedCard";

const Feed = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feed", id],
    queryFn: () => getFeed({ id }),
  });

  return (
    <>
      {isLoading && (
        <div className='mt-20 flex justify-center'>
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
      {data && (
        <FeedCard
          feed={data}
          search={false}
        />
      )}
    </>
  );
};

export default Feed;
