import React from "react";
import { Routes, Route, Link } from "react-router-dom"
import logoPath from "../images/logo.svg";
import burgerIcon from "../images/burger-icon.svg"
import closeIcon from "../images/menu-close-icon.svg"
import BurgerMenu from "./BurgerMenu";

function Header(props) {

    return (
        <header className="header">
            {props.loggedIn &&
                <BurgerMenu userEmail={props.userEmail} signOut={props.signOut} isOpen={props.isOpen} />
            }
            <div className="header__container">
                <img alt="Логотип" className="header__logo" 
                    src={logoPath} 
                />
                {
                    <Routes>
                        <Route exact path="/" element={
                            (
                                <>
                                    <div className="header__menu header__menu_hidden">
                                        <p className="header__text">{props.userEmail}</p>
                                        <Link to="/sign-in" className="header__link" onClick={props.signOut}>Выйти</Link>
                                    </div>
                                    <div className="header__burger-menu-container">
                                        <button className="header__burger-menu" onClick={props.handleClick}>
                                            {!props.isOpen ? 
                                                <img src={burgerIcon} alt="Открыть меню" /> 
                                            :
                                                <img src={closeIcon} alt="Закрыть меню" />
                                            }
                                        </button>
                                    </div>
                                </>
                                
                            )
                        } />
                            
                        <Route path="/sign-up" element={
                            <Link className="header__link" to="/sign-in">
                                Войти
                            </Link>
                        }/>
                        <Route path="/sign-in" element={
                            <Link className="header__link" to="/sign-up">
                            Регистрация
                            </Link>
                        } />
                    </Routes>
                }
            </div>
        </header>
    )
}

export default Header;