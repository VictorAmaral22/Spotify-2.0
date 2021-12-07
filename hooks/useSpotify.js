import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
// import spotifyApi from "../lib/spotify"; // Server
import SpotifyWebApi from "spotify-web-api-node";

// Locally
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
})

export default function useSpotify(props) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if(session){
            if(session.error === 'RefreshAccessTokenError'){
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);

    return spotifyApi;
}
