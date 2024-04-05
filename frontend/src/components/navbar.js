import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        return navigate("/login");
    };

    return (
        <ReactNavbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    {user && <Nav.Link href="/profile">Profile</Nav.Link>}
                    <Nav.Link href="/mbtaAlerts">MBTA Alerts</Nav.Link>
                    <Nav.Link href="/liveMap">Live Map</Nav.Link>

                    {!user && <Nav.Link href="/signUp">Sign Up</Nav.Link>}
                    {!user && <Nav.Link href="/login">Login</Nav.Link>}

                    {user && (
                        <Nav.Link
                            href="/logout"
                            onClick={(e) => handleClick(e)}
                        >
                            Log out
                        </Nav.Link>
                    )}
                </Nav>
            </Container>
        </ReactNavbar>
    );
}
