import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../utils/http";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { statusChangeFlash } from "../messages/Flash/showFlash";

const useLogout = ({ sessionExpired }) => {
  const dispatch = useDispatch();
  const { mutate: logoutMutate, isPending: logoutPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(signOutSuccess());
      if (sessionExpired) {
        dispatch(statusChangeFlash("Error", "Session expired! Sign in again."));
      } else {
        dispatch(statusChangeFlash("Logout"));
      }
    },
    onError: (error) => {
      dispatch(statusChangeFlash("Error", error.message));
    },
  });
  return {
    logoutMutate,
    logoutPending,
  };
};

export default useLogout;
