"use client"
import {useState} from 'react'


export default function Home() {
    const [elements, setElements] = useState([])
    const [currentPair, setCurrentPair] = useState([null, null])
    const [points, setPoints] = useState({})
    const [roundStarted, setRoundStarted] = useState(false)
    const [roundEnded, setRoundEnded] = useState(false)

    const addElement = (event) => {
        event.preventDefault();
        const newElement = event.target.elements.element.value;
        setElements([...elements, newElement]);
        setPoints({...points, [newElement]: 0});
        event.target.reset();
    }

    const removeElement = (element) => {
        setElements(elements.filter(e => e !== element));
        const newPoints = {...points};
        delete newPoints[element];
        setPoints(newPoints);
    };

    const startGame = () => {
        if (elements.length < 2) return;
        setCurrentPair([elements[0], elements[1]]);
        setRoundStarted(true);
    }

    const handleChoice = (choice) => {
        setPoints({
            ...points,
            [choice]: points[choice] + 1
        });

        const nextPair = getNextPair(currentPair);
        if (nextPair[0] && nextPair[1]) {
            setCurrentPair(nextPair);
        } else {
            setRoundEnded(true);
        }
    }

    const getNextPair = ([a, b]) => {
        const currentIndexA = elements.indexOf(a);
        const currentIndexB = elements.indexOf(b);

        if (currentIndexB < elements.length - 1) {
            return [a, elements[currentIndexB + 1]];
        } else if (currentIndexA < elements.length - 2) {
            return [elements[currentIndexA + 1], elements[currentIndexA + 2]];
        } else {
            return [null, null];
        }
    };

    const getRanking = () => {
        return Object.entries(points)
            .sort((a, b) => b[1] - a[1])
    }

    return (


        <div className="p-12 bg-gradient-to-t from-[#FF4F2D] via-[#FF8B74] to-[#FF89FF] min-h-screen text-white flex
      flex-col items-center">
            <h1 className="text-7xl font-bold ">Would You Rather</h1>
            <div className={"flex flex-col items-center justify-center w-full flex-1 pb-36"}>
                {!roundStarted && (
                    <>
                        <form onSubmit={addElement} className="mb-4 text-black">
                            <input
                                name="element"
                                type="text"
                                placeholder="Add Element..."
                                className="p-2 mr-2 rounded-md text-xl"
                                required
                            />
                            <button type="submit"
                                    className="bg-blue-400 rounded-md text-xl text-white p-2 hover:bg-blue-500 mr-2 w-20">Add
                            </button>
                        </form>
                        {elements.length > 1 && (
                            <button onClick={startGame}
                                    className="bg-green-500 rounded-md text-white text-xl p-2 mb-4 hover:bg-green-600 w-48">Start
                                Round</button>
                        )}
                    </>
                )}


                {!roundStarted && (
                    <ul>
                        {elements.map((element, index) => (
                            <li key={element}
                                onClick={() => removeElement(element)}
                                className="cursor-pointer hover:text-red-500 flex justify-start text-2xl">
                                {index + 1}. {element}
                            </li>
                        ))}
                    </ul>
                )}

                {currentPair[0] && currentPair[1] && !roundEnded ? (
                    <div className={"flex items-center justify-center flex-col"}>
                        <h2 className="text-3xl mb-4">Would you rather pick...</h2>
                        <div>
                            <button onClick={() => handleChoice(currentPair[0])}
                                    className="bg-blue-500 text-xl text-white rounded-md hover:bg-blue-600 w-64 h-20 p-2 m-2">
                                {currentPair[0]}
                            </button>
                            <span className={"text-3xl"}>or</span>
                            <button onClick={() => handleChoice(currentPair[1])}
                                    className="bg-blue-500 text-xl text-white rounded-md hover:bg-blue-600 w-64 h-20 p-2 m-2">
                                {currentPair[1]}
                            </button>
                        </div>
                    </div>
                ) : roundEnded ? (
                    <div className={"flex justify-center flex-col items-center"}>
                        <h2 className="text-7xl  font-bold mb-4">Ranking</h2>
                        <button onClick={() => {
                            setRoundStarted(false);
                            setRoundEnded(false);
                            setCurrentPair([null, null]);
                            setElements([]);
                            setPoints({});
                        }}
                                className="bg-green-500 rounded-md text-white text-xl p-2 mb-4 hover:bg-green-600 w-48">New Round
                        </button>
                        <ul className="text-3xl font-semibold">
                            {getRanking().map(([element, point]) => (
                                <li key={element}>{element}: {point}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
