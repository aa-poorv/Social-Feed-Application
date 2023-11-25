import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const signUp = async ({ formData }) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = new Error("An error happened while creating the User!!");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const userCreation = await response.json();

  return userCreation;
};

export const signIn = async ({ formData }) => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = new Error("An error happened while Signing in!!");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const userData = await response.json();

  return userData;
};

export const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("Couldn't log out");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const userData = await response.json();

  return userData;
};

export const createFeed = async ({ message }) => {
  if (message.trim().length > 280 || message.trim().length === 0)
    throw new Error("Message is not valid!!");
  const response = await fetch("/api/user/feed/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = new Error("Couldn't create feed");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const feedData = await response.json();

  return feedData;
};

export const getFeed = async ({ id }) => {
  const response = await fetch(`/api/feed/${id}`);

  if (!response.ok) {
    const error = new Error("Couldn't get feed");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const feedData = await response.json();

  return feedData;
};

export const postComment = async ({ comment, feedId }) => {
  const response = await fetch(`/api/feed/comment/${feedId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok) {
    const error = new Error("Couldn't post comment");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
};

export const getComment = async ({ feedId, pageParam }) => {
  const response = await fetch(
    `/api/feed/comment/${feedId}?&page=` + pageParam
  );

  if (!response.ok) {
    const error = new Error("Couldn't fetch comments");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
};

export const getUserFeed = async () => {
  const response = await fetch(`/api/user/feed`);

  if (!response.ok) {
    const error = new Error("Couldn't fetch comments");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
};

export const getSearchTermFeed = async ({ searchTerm, pageParam }) => {
  const response = await fetch(
    `/api/user/search?${searchTerm}&page=${pageParam}`
  );

  if (!response.ok) {
    const error = new Error("Couldn't fetch Feeds");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return await response.json();
};
