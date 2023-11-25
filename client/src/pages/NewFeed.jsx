import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createFeed } from "../utils/http";

const NewFeed = () => {
  const navigate = useNavigate();
  const [messageValue, setMessageValue] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createFeed,
    onSuccess: (data) => {
      navigate(`/feed/${data._id}`);
    },
  });

  const messageChangeHandler = (event) => {
    setMessageValue(event.target.value);
  };

  const feedSubmitHandler = (event) => {
    event.preventDefault();
    mutate({ message: messageValue });
  };

  return (
    <div className='max-w-xl mx-auto p-2 mt-20'>
      <form
        className='flex flex-col gap-3'
        onSubmit={feedSubmitHandler}
      >
        <p className='text-center text-3xl text-zinc-700 mb-4 font-bold'>
          New Feed
        </p>

        <textarea
          placeholder='Enter your message...'
          id='message'
          rows='5'
          onChange={messageChangeHandler}
          value={messageValue}
          className='border border-gray-700 p-3 rounded-lg'
        ></textarea>
        {messageValue.trim().length > 280 && (
          <p className='text-red-500'>
            Message should be less than 280 characters
          </p>
        )}
        <div className='flex justify-end gap-2'>
          <button
            type='submit'
            disabled={isPending}
            className='uppercase p-3 flex-1 bg-blue-500 text-white rounded-lg hover:opacity-95 disabled:opacity-80 disabled:cursor-wait'
          >
            {isPending ? "Submitting" : "Submit"}
          </button>
          <Link
            to='/profile'
            className='flex-1 inline-block'
          >
            <button
              disabled={isPending}
              className='uppercase p-3 bg-slate-600 w-full text-white rounded-lg hover:opacity-95 disabled:opacity-80 disabled:cursor-wait'
            >
              {" "}
              Cancel{" "}
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewFeed;
