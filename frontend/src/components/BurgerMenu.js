import React from "react";
import { Link } from "react-router-dom";

export default function BurgerMenu(props) {
    return (
        <div className={`burger-menu ${props.isOpen && "burger-menu_active"}`}>
            <p className="burger-menu__text">{props.userEmail}</p>
            <Link to="/sign-in" className="burger-menu__link" onClick={props.signOut}>Выйти</Link>
        </div>
    )
}