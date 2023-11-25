import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserFeed, logoutUser } from "../utils/http";
import { TailSpin } from "react-loader-spinner";
import { signOutSuccess } from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showFeeds, setShowFeeds] = useState(false);
  const { data: feeds, isLoading } = useQuery({
    queryKey: ["user", "feed", currentUser._id],
    queryFn: getUserFeed,
  });

  const dispatch = useDispatch();
  const { mutate: logoutMutate, isPending: logoutPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(signOutSuccess());
    },
  });

  return (
    <>
      <div className='max-w-xl p-3 mx-auto flex flex-col items-center mt-12 gap-6'>
        <p className='text-center text-3xl font-bold'>Profile</p>
        <img
          src={currentUser.avatar}
          className='h-20 w-20 block rounded-full'
          alt='Profile Image'
        />
        <div className='flex gap-2 text-xl'>
          <p className='font-medium text-zinc-800'>Username:</p>
          <p>{currentUser.username}</p>
        </div>
        <div className='flex gap-2 text-xl'>
          <p className='font-medium text-zinc-800'>Name:</p>
          <p>{currentUser.name}</p>
        </div>
        <div className='w-full text-center'>
          <Link to='/create-feed'>
            <button className='p-3 bg-slate-600 w-full rounded-lg text-white mb-2 uppercase hover:opacity-95'>
              Create New Feed
            </button>
          </Link>
          <p
            onClick={() => logoutMutate()}
            className='p-3 text-orange-500 text-xl cursor-pointer'
          >
            {logoutPending ? "logging out..." : "logout"}
          </p>
          <p
            onClick={() => setShowFeeds((feeds) => !feeds)}
            className='p-3 text-green-500 text-xl cursor-pointer'
          >
            All Posts
          </p>
        </div>
        {showFeeds && (
          <div className='flex flex-col gap-3 w-full mb-8'>
            <h1 className='text-xl text-center font-semibold'>Posts</h1>
            {isLoading && (
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
            {feeds &&
              feeds.map((feed) => (
                <Link
                  to={`/feed/${feed._id}`}
                  key={feed._id}
                >
                  <h1 className='px-5 py-3 border border-gray-600 rounded-xl'>
                    {feed.message}
                  </h1>
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
