import  {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from "@heroicons/react/outline";

function Sidebar() {
    return (
        <div className="text-gray-500 p-5 text-sm border-r border-gray-900">

            <div>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
            </div>

            <div>
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5" />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5" />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
            </div>    

            {/* Playlists */}
            <p className="cursor-pointer hover:text-white">Só as sofrências</p>
            <p className="cursor-pointer hover:text-white">Guns n' Roses</p>
            <p className="cursor-pointer hover:text-white">Top 10 músicas dos animes</p>
            <p className="cursor-pointer hover:text-white">Metallica</p>
            <p className="cursor-pointer hover:text-white">Playlist Aleatória</p>
            <p className="cursor-pointer hover:text-white">Música pra fazer p*taria</p>
            <p className="cursor-pointer hover:text-white">Só os games</p>
            <p className="cursor-pointer hover:text-white">Salve salve</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
            <p className="cursor-pointer hover:text-white">Playlist 1</p>
        </div>
    )
}

export default Sidebar
