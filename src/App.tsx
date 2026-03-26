import { ThemeProvider } from './context/ThemeProvider'
import Navbar from './components/Navbar'
import ThemeContent from './components/ThemeContent'

function App() {
    return (
        <ThemeProvider>
            <Navbar />
            <ThemeContent />
        </ThemeProvider>
    )
}

export default App