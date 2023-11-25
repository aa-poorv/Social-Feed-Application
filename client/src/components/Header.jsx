/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./css/header.css";
import LazyLoading from "./UI/LazyLoading";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [navCollapse, setNavCollapse] = useState(false);
  const [imageDelay, setImageDelay] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  window.addEventListener("resize", () => setScreenSize(window.innerWidth));

  const navigate = useNavigate();

  const searchChangeHandler = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchSubmitHandler = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between'>
        <div
          className={`flex flex-col sm:flex-row items-center sm:max-w-6xl sm:mx-auto p-3 sm:flex-1 sm:!h-auto`}
        >
          <div className='flex-[1.2_4_auto] self-start sm:self-center'>
            <Link
              to='/'
              className='mx-2.5 sm:mx-0 inline'
            >
              <span className='font-bold text-base sm:text-xl'>
                <span className='text-slate-500'>Feed</span>
                <span className='text-slate-700'>App</span>
              </span>
            </Link>
          </div>
          <div
            id='moving'
            className={`${
              navCollapse ? "nav-open" : ""
            } sm:flex sm:flex-[1_1_auto]`}
          >
            <div
              className={`flex flex-col-reverse sm:flex-row sm:justify-between items-start sm:items-center inner flex-1`}
            >
              <form
                className='bg-slate-100 p-3 sm:p-3 mx-2.5 h-9 sm:h-auto rounded-lg flex justify-between items-center mb-0.5 sm:mb-0'
                onSubmit={searchSubmitHandler}
              >
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={searchChangeHandler}
                  className='bg-transparent focus:outline-none w-[20%] flex-1 sm:w-64'
                />
                <button type='submit'>
                  <FaSearch className='text-slate-600' />
                </button>
              </form>
              <ul className='flex flex-col-reverse mx-2.5 sm:mx-0 sm:flex-row pt-0 text-sm sm:text-base my-[9px] sm:my-0 items-center gap-2 sm:gap-4'>
                {!currentUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "underline text-gray-800" : undefined
                    }
                    to='/'
                  >
                    <li className='inline text-slate-700 hover:underline'>
                      Sign in
                    </li>
                  </NavLink>
                )}
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "underline text-gray-800" : undefined
                  }
                  to='/profile'
                >
                  {currentUser ? (
                    <div className=''>
                      {imageDelay || screenSize >= 640 ? (
                        <LazyLoading src={currentUser.avatar} />
                      ) : (
                        <div className='h-[26px] w-[26px] bg-slate-200'></div>
                      )}
                    </div>
                  ) : (
                    <li className='inline ml-[2px] text-slate-700 hover:underline'>
                      Sign up
                    </li>
                  )}
                </NavLink>
              </ul>
            </div>
          </div>
        </div>

        <div className='sm:hidden mr-2.5 sm:mr-0 self-start pt-[7.2px]'>
          <button
            onClick={() => {
              setNavCollapse((navValue) => !navValue);
              setTimeout(() => {
                setImageDelay(true);
              }, 400);
            }}
            className='border border-zinc-300 px-1 rounded-md'
          >
            <IoReorderThreeOutline className='!w-[2em] !h-auto' />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
