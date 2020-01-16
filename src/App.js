// @flow
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import Game from "./Game";

import "./style.global.css";

const CenteredDiv = styled.div`
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
`;

export default function App() {
    const [gameKey, setGameKey] = useState(0);

    const handleRestart = () => {
        setGameKey((key) => key + 1);
    };

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
            <Game key={gameKey} onRestart={handleRestart} />
        </Container>
    );
}
