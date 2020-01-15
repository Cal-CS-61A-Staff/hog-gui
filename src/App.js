// @flow
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import DiceResults from "./DiceResults";

import "./style.global.css";
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

const CenteredDiv = styled.div`
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
`;

export default function App() {
    const [state, setState] = useState<State>(states.WAITING_FOR_INPUT);
    const [displayedRolls, setDisplayedRolls] = useState<number[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [scores, setScores] = useState<[number, number]>([0, 0]);
    const [numRolls, setNumRolls] = useState<number>(0);

    const handleRoll = async (inputNumRolls) => {
        setState(states.ROLLING_DICE);
        setNumRolls(inputNumRolls);
        const orderedScores = [scores[playerIndex], scores[1 - playerIndex]];
        const [{ rolls, finalScores }] = await Promise.all([
            post("/take_turn", { scores: orderedScores, numRolls: inputNumRolls }),
            wait(3000),
        ]);
        setDisplayedRolls(rolls);
        setScores([finalScores[playerIndex], finalScores[1 - playerIndex]]);
        setState(states.DISPLAYING_CHANGE);
        await wait(1000);
        setState(states.WAITING_FOR_INPUT);
        setPlayerIndex(1 - playerIndex);
    };

    const diceDisplay = {
        [states.WAITING_FOR_INPUT]: (
            <RollButton
                playerIndex={playerIndex}
                rolling={state === states.ROLLING_DICE}
                onClick={handleRoll}
            />
        ),
        [states.ROLLING_DICE]: <RollingDice numRolls={numRolls} />,
        [states.DISPLAYING_CHANGE]: <DiceResults rolls={displayedRolls} />,
    }[state];

    return (
        <Container>
            <Row>
                <Col>
                    <CenteredDiv>
                        <h1 className="display-4">
                            The Game of
                            {" "}
                            <b>Hog.</b>
                        </h1>
                    </CenteredDiv>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ScoreIndicators scores={scores} />
                </Col>
            </Row>
            <Row>
                {diceDisplay}
            </Row>
        </Container>
    );
}
