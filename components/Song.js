import { useRecoilState } from "recoil";
import { isPlayingState, playlistIdState } from '../atoms/playlistAtom';
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify"
import { millisToMinutesAndSeconds } from "../lib/time"

function Song({order, track}) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [playlistId, setPlaylistIdS] = useRecoilState(playlistIdState);

    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);

        spotifyApi.play({
            "context_uri": `spotify:playlist:${playlistId}`,
            "offset": {
                "position": order
            }
        })
    }
    
    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer justify-between"
        onClick={playSong}>
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img src={track.track.album.images[0].url} alt="" className="h-10 w-10"/>
                <div>
                    {currentTrackId == track.track.id ? (
                        <p className="w-36 lg:w-64 truncate text-green-500">{track.track.name}</p>
                    ) : (
                        <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>    
                    )}
                    {currentTrackId == track.track.id ? (
                        <p className="w-40 text-green-500">{track.track.artists[0].name}</p>
                    ) : (
                        <p className="w-40">{track.track.artists[0].name}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between nl-auto md:ml-0">
                {currentTrackId == track.track.id ? (
                    <p className="w-40 hidden md:inline text-green-500">{track.track.album.name}</p>
                ) : (
                    <p className="w-40 hidden md:inline">{track.track.album.name}</p>
                )}
                {currentTrackId == track.track.id ? (
                    <p className="text-green-500">{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
                ) : (
                    <p className="">{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
                )}
            </div>
        </div>
    )
}

export default Song
