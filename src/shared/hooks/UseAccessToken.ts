import { getAccessToken, isUserAuthenticated } from "../API/SpotifyAuth";

export const useAccessToken = () => {
  if (!isUserAuthenticated()) {
    return null;
  }

  return getAccessToken();
};
