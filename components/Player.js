import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { isPlayingState } from "../atoms/playlistAtom";
import { currentTrackIdState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import useSongInfo from "../hooks/useSongInfo";
import { useState } from 'react';
import { useEffect } from "react";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import { RewindIcon, FastForwardIcon, PlayIcon, PauseIcon, VolumeUpIcon } from "@heroicons/react/solid";


function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const [switchingSongs, setSwitchingSongs] = useState(0);

    const songInfo = useSongInfo(spotifyApi);

    const fetchCurrentSong = () => {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            console.log('Now playing ',data.body?.item?.id)
            setCurrentTrackId(data.body?.item?.id);
            
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setIsPlaying(data.body?.is_playing);
            })
        })

        console.log('caralho ',currentTrackId);
    }

    const previousSong = () => {
        spotifyApi.skipToPrevious();
        setSwitchingSongs(switchingSongs+1)
    }

    const nextSong = () => {
        spotifyApi.skipToNext();
        setSwitchingSongs(switchingSongs+1);
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session, switchingSongs])

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid-cols-3 text-xs md:text-base px-2 md:px-8 grid">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" /> 

                <RewindIcon className="button" onClick={() => previousSong()} /> 

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button" />               
                )}

                <FastForwardIcon className="button" onClick={() => nextSong()} />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end">
                <VolumeUpIcon className="button" />
                <input type="range"  />
            </div>
        </div>
    );
}

export default Player;