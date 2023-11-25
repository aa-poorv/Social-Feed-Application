/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import Comments from "./Comments";

const FeedCard = ({ feed, search }) => {
  const [commentShow, setCommentShow] = useState(false);
  return (
    <div
      className={`max-w-md p-5 mx-auto ${
        search ? "my-3" : "my-20"
      } flex flex-col gap-4 border border-gray-400 rounded-lg shadow-md hover:shadow-lg`}
    >
      <p className='text-2xl font-medium text-zinc-700'>{feed.message}</p>
      <div className='flex justify-between'>
        <p className='text-gray-600 text-sm'>{feed.owner.name}</p>
        <span
          onClick={() => setCommentShow((comment) => !comment)}
          className='flex gap-1 hover:opacity-90 cursor-pointer'
        >
          <FaComment className='mt-1' /> {feed.comments.length}
        </span>
      </div>
      {commentShow && <Comments feedId={feed._id} />}
    </div>
  );
};

export default FeedCard;
