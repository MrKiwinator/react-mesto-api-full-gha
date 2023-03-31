import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../context/CurrentUserContext";

function Main(props) {
    // Hooks:
    const currentUser = React.useContext(CurrentUserContext);
    
    return (
        <main className="main">
        
            <section className="profile">
                <button className="profile__edit-avatar-btn" 
                    onClick={props.onEditAvatar}
                >
                    <img alt="Аватар пользователя" className="profile__avatar" 
                        src={currentUser.avatar} 
                    />
                </button>
                        
                <div className="profile__info">
                    <div className="profile__flex-container">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__edit-button" type="button" aria-label="Редактировать профиль" 
                            onClick={props.onEditProfile}
                        />
                    </div>
                    <p className="profile__status">{currentUser.about}</p>
                </div>
                <button className="profile__add-button" type="button" aria-label="Добавить изображение" 
                    onClick={props.onAddPlace}
                ></button>
            </section>
            
            <section className="elements" aria-label="Изображения">
                    {props.cards.map(card => (
                        <Card 
                            key={card._id}
                            card={card}
                            onCardClick={props.onCardClick}
                            onCardLike={props.onCardLike}
                            onCardDelete={props.onCardDelete}
                        />
                    ))}
            </section>
            
        </main>
    )
}

export default Main;