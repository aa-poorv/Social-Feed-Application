/* eslint-disable react/prop-types */
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getComment, postComment, queryClient } from "../utils/http";
import { TailSpin } from "react-loader-spinner";

const Comments = ({ feedId }) => {
  const [commentMessage, setCommentMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const {
    data: comments,
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: commentError,
  } = useInfiniteQuery({
    queryKey: ["comments", feedId],
    queryFn: ({ pageParam = 1 }) => getComment({ feedId, pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length === 6 ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      setCommentMessage("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      return queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const commentSubmitHandler = (event) => {
    event.preventDefault();
    mutate({ comment: commentMessage, feedId });
  };

  return (
    <div>
      {currentUser && (
        <form
          className='flex gap-1 my-1'
          onSubmit={commentSubmitHandler}
        >
          <input
            type='text'
            className='p-2 flex-[3_3_auto] rounded-lg'
            onChange={(e) => setCommentMessage(e.target.value)}
            value={commentMessage}
            placeholder='Post your reply...'
          />
          <button
            type='submit'
            disabled={isPending}
            className='p-2 flex-[1_1_auto] bg-amber-500 text-white rounded-lg hover:opacity-95 disabled:opacity-80 hover:shadow'
          >
            {isPending ? "Replying" : "Reply"}
          </button>
        </form>
      )}
      {status === "pending" && (
        <div className='flex justify-center'>
          <TailSpin
            height='40'
            width='40'
            color='black'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
      {status === "error" && (
        <div>
          <p className='text-red-500'>{commentError}</p>
        </div>
      )}
      {status === "success" && (
        <>
          {comments.pages[0].length === 0 && (
            <div className='flex justify-center '>
              <span className='text-base font-medium text-gray-500 mt-5'>
                No comments to show!!
              </span>
            </div>
          )}
          {comments.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((comment) => (
                <div
                  className='flex flex-col gap-3'
                  key={comment._id}
                >
                  <div>
                    <span className='text-sm font-normal mr-2'>
                      {comment.owner.name}:
                    </span>
                    <span>{comment.message}</span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
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

export default Comments;
