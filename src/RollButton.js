// @flow
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { numberStrings } from "./constants";

const Wrapper = styled.div`
    font-size: 1.25rem;
    width: 100%;
    text-align: center;
    margin: 20px;
`;

type Props = { playerIndex: number, onClick: (number) => mixed};

export default function RollButton({ playerIndex, onClick }: Props) {
    const [numberOfRolls, setNumberOfRolls] = useState(0);

    const handleChange = (e) => {
        const val = Math.max(Math.min(10, e.target.value), 0);
        setNumberOfRolls(e.target.value && val);
    };

    const handleClick = () => {
        onClick(numberOfRolls);
    };

    return (
        <Wrapper>
            <p>
                It is Player
                {" "}
                <b>
                    {numberStrings[playerIndex]}
                    &lsquo;s
                </b>
                {" "}
                turn.
            </p>
            <p>
                Roll
                {" "}
                <input type="number" min={0} max={10} value={numberOfRolls} onChange={handleChange} />
                {" "}
            Dice.
            </p>
            <p>
                <Button variant={["primary", "warning"][playerIndex]} size="lg" onClick={handleClick}> Roll!</Button>
            </p>
        </Wrapper>
    );
}
