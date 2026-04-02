import { NavLink } from "react-router-dom"; 

const LINKS =[
    { to: '/', label: 'Home' },
    { to: '/movies/popular', label: 'Popular' },
    { to: '/movies/now_playing', label: 'Now Playing' },
    { to: '/movies/top_rated', label: 'Top Rated' },
    { to: '/movies/upcoming', label: 'Upcoming' },
];

export const Navbar = () => {
    return (
        <div className='flex justify-center gap-5 p-4'>
            {LINKS.map(({ to, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => {
                        return isActive ? 'text-[#b2dab1] font-bold' : 'text-gray-500';
                    }}
                >
                    {label}
                </NavLink>
            ))}
        </div>
    );
};