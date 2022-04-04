import { render, useState, createElement } from './src/react.js'

function App() {
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);

    const changeA = () => setA(a + 1)
    const changeB = () => setB(v => v + 2)

    return [createElement(a, changeA), createElement(b, changeB)]
}

render(App, document.getElementById("root"))

