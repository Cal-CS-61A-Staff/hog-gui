// @flow
import React, { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Commentary from "./Commentary";
import DiceResults from "./DiceResults";

import post from "./post";
import RollButton from "./RollButton";
import RollingDice from "./RollingDice";
import ScoreIndicators from "./ScoreIndicators";
import { wait } from "./utils";

const states = {
    WAITING_FOR_INPUT: "WAITING_FOR_INPUT",
    ROLLING_DICE: "ROLLING_DICE",
    DISPLAYING_CHANGE: "DISPLAYING_CHANGE",
};

type State = $Keys<typeof states>;

export default function Game({ onRestart } : { onRestart: () => mixed }) {
    const [state, setState] = useState<State>(states.WAITING_FOR_INPUT);
    const [displayedRolls, setDisplayedRolls] = useState<number[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [scores, setScores] = useState<[number, number]>([0, 0]);
    const [numRolls, setNumRolls] = useState<number>(0);
    const [message, setMessage] = useState<string>("");

    const moveHistory = useRef([]);
    const rollHistory = useRef([]);

    const handleRoll = async (inputNumRolls) => {
        setState(states.ROLLING_DICE);
        setNumRolls(inputNumRolls);
        moveHistory.current.push(inputNumRolls);
        const [{ message: newMessage, rolls, finalScores }] = await Promise.all([
            post("/take_turn", {
                prevRolls: rollHistory.current,
                moveHistory: moveHistory.current,
            }),
            ...[inputNumRolls && wait(1000)],
        ]);
        setDisplayedRolls(rolls.slice(rollHistory.current.length));
        setScores(finalScores);
        setState(states.DISPLAYING_CHANGE);
        setMessage(newMessage);
        rollHistory.current = rolls;
        await wait(2500);
        setState(states.WAITING_FOR_INPUT);
        setPlayerIndex(1 - playerIndex);
    };

    const diceDisplay = {
        [states.WAITING_FOR_INPUT]: (
            <RollButton
                playerIndex={playerIndex}
                rolling={state === states.ROLLING_DICE}
                onClick={handleRoll}
                onRestart={onRestart}
            />
        ),
        [states.ROLLING_DICE]: <RollingDice numRolls={numRolls} />,
        [states.DISPLAYING_CHANGE]: <DiceResults rolls={displayedRolls} />,
    }[state];

    return (
        <>
            <Row>
                <Col>
                    <ScoreIndicators scores={scores} />
                </Col>
            </Row>
            <Row>
                {diceDisplay}
            </Row>
            {state === states.DISPLAYING_CHANGE && (
                <Row>
                    <Commentary text={message} />
                </Row>
            )}
        </>
    );
}
