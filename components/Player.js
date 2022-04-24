import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { isPlayingState, playlistIdState } from "../atoms/playlistAtom";
import { currentTrackIdState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import useSongInfo from "../hooks/useSongInfo";
import { useState } from 'react';
import { useEffect } from "react";
import { RefreshIcon, SwitchHorizontalIcon } from "@heroicons/react/outline";
import { RewindIcon, FastForwardIcon, PlayIcon, PauseIcon, VolumeUpIcon } from "@heroicons/react/solid";


function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [playlistId, setPlaylistIdS] = useRecoilState(playlistIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);

    const [songInfo, setSongInfo] = useState(null);

    console.log('songInfo ',songInfo);

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

    const fetchCurrentSong =  async () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);
                
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
        
    }

    const previousSong = () => {
        spotifyApi.skipToPrevious().then(() => {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);
            })
        });
    }

    const nextSong = () => {
        spotifyApi.skipToNext().then(() => {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);
            })
        });
    }

    console.log('currentTrackId ',currentTrackId);
    console.log('songInfo ',songInfo);
    console.log('token ',spotifyApi.getAccessToken())

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

    const handleShuffle = () => {
        setIsShuffle(!isShuffle);
        spotifyApi.setShuffle(isShuffle ? 'false' : 'true').then((data) => {
            console.log('data ',data)
        });
    }

    const handleRepeating = () => {
        setIsRepeating(!isRepeating);
        spotifyApi.setRepeat(isRepeating ? 'off' : 'context').then((data) => {
            console.log('data ',data)
        });
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        const handleVolume = async () => {
            const devices = await spotifyApi.getMyDevices();
            console.log('devices ',devices.body.devices.filter(item => item.is_active))
            if(devices.body.devices.filter(item => item.is_active)) {
                if(devices.body.devices.filter(item => item.is_active).find(item => item.type != 'Smartphone')) {
                    spotifyApi.setVolume(volume);
                }
            } 
        }

        handleVolume();
    }, [volume, spotifyApi]);

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid-cols-1 md:grid-cols-3 text-xs md:text-base px-2 md:px-8 grid">
            {/* Left */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-5 md:space-x-4">
                    <img className="inline h-12 w-13 md:h-10 md:w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                    <div className="flex-col ">
                        <h3 className="text-base md:text-sm">{songInfo?.name}</h3>
                        <p className="text-xs md:text-sm">{songInfo?.artists?.[0]?.name}</p>
                    </div>
                </div>

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button md:hidden mx-5" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button md:hidden mx-5" />
                )}
            </div>

            {/* Center */}
            <div className="items-center hidden md:flex md:justify-self-center justify-evenly w-10 md:w-2/3 md:space-x-3 justify-self-end">
                {isShuffle ? (
                    <SwitchHorizontalIcon className="small-button text-green-500 hidden md:flex" onClick={handleShuffle} /> 
                ) : (
                    <SwitchHorizontalIcon className="small-button hidden md:flex" onClick={handleShuffle} /> 
                )}

                <RewindIcon className="button hidden md:flex" onClick={() => previousSong()} /> 

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button hidden md:flex" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button hidden md:flex" />               
                )}

                <FastForwardIcon className="button hidden md:flex" onClick={() => nextSong()} />
                
                {isRepeating ? (
                    <RefreshIcon className="small-button text-green-500 hidden md:flex" onClick={handleRepeating} />
                ) : (
                    <RefreshIcon className="small-button hidden md:flex" onClick={handleRepeating} />
                )}
            </div>
            
    

            {/* Right */}
            <div className="hidden md:flex items-center mx-4 md:space-x-4 justify-end">
                <VolumeUpIcon className="small-button hidden md:flex" />
                <input type="range" className="text-green-500 hidden md:flex" defaultValue={volume} onChange={(e) => setVolume(e.target.value)} />
            </div>
        </div>
    );
}

export default Player;