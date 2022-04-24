import { atom } from "recoil";

export const playlistState = atom({
    key: 'playlistState',
    default: null
})

export const playlistIdState = atom({
    key: 'playlistIdState',
    default: '1nMzu3VR4IkJVRDkGMm4B4',
})

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false
})