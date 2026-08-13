const ACCESS_TOKEN = 'access_token'

export const useAccessToken = () => {
    let accessToken = null;
    try {
        accessToken = localStorage.getItem(ACCESS_TOKEN)
    } catch (e) {
        console.error("Couldn't extract the token from LS", e)
    }

    return accessToken;
}