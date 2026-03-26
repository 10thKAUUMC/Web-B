import { THEME, useTheme } from '../context/ThemeProvider';
import clsx from 'clsx';

export default function ThemeContent() {
    const { theme } = useTheme();  // useContext → useTheme

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div
            className={clsx(
                'p-4 h-dvh w-full',
                isLightMode ? 'bg-white' : 'bg-gray-800'  // 따옴표 수정
            )}
        >
            <h1
                className={clsx(  // classsName → className
                    'text-xl font-bold',
                    isLightMode ? 'text-black' : 'text-white'
                )}
            >
                Theme content
            </h1>
            <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
            </p>
        </div>
    );
}