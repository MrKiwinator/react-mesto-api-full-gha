import React from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";

function Card(props) {
    // Hooks:
    const currentUser = React.useContext(CurrentUserContext);

    // Check if user is owner of the card:
    const isOwn = props.card.owner === currentUser._id;

    // Check if user set like to the card:
    const isLiked = props.card.likes.some(userLikeId => userLikeId === currentUser._id);

    // Like button style:
    const cardLikeButtonClassName = ( 
        `element__like ${isLiked && 'element__like_active'}` 
      );

    function handleCardClick () {
        props.onCardClick(props.card);
    }

    function handleLikeClick () {
        props.onCardLike(props.card);
    }

    function handleCardDelete () {
        props.onCardDelete(props.card);
    }

    return (
        <article className="element" >
            <img className="element__picture" 
                src={props.card.link} 
                alt={props.card.name} 
                onClick={handleCardClick} 
            />
            <div className="element__note">
                <h2 className="element__place">{props.card.name}</h2>
                <div className="element__like-container">
                    <button type="button" aria-label="Нравится" 
                        className={cardLikeButtonClassName} 
                        onClick={handleLikeClick}
                    ></button>
                    <span className="element__like-counter">{props.card.likes.length}</span>
                </div>
            </div>
            {isOwn && <button type="button" aria-label="Удалить" className="element__delete" 
                onClick={handleCardDelete}
            />}
        </article>
    )
}

export default Card;