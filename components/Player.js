import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { isPlayingState, playlistIdState } from "../atoms/playlistAtom";
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
    const [playlistId, setPlaylistIdS] = useRecoilState(playlistIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {
      const fetchSongInfo = async () => {
            if(currentTrackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                        }
                    }
                ).then((res) => res.json());

                setSongInfo(trackInfo);
            }
      }

      fetchSongInfo();
    }, [currentTrackId, spotifyApi]);

    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log('Now playing ',data.body?.item?.id)
                setCurrentTrackId(data.body?.item?.id);
                
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const previousSong = () => {
        spotifyApi.skipToPrevious();
    }

    const nextSong = () => {
        spotifyApi.skipToNext();
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
    }, [currentTrackId, spotifyApi, session])

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
            <div className="flex items-center justify-self-center justify-evenly w-2/3">
                <SwitchHorizontalIcon className="small-button" /> 

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
                <VolumeUpIcon className="small-button" />
                <input type="range"  />
            </div>
        </div>
    );
}

export default Player;