function ImagePopup(props) {
    return(
        <div className={`popup picture-popup popup_opacity_low 
            ${props.card && "popup_opened"}`}
        >
            <div className="popup__image-container" >
                <img className="popup__image" 
                    src={props.card?.link} 
                    alt={props.card? props.card.name : ""} 
                />
                <button aria-label="Закрыть" type="button" className="popup__close-btn" 
                    onClick={props.onClose}
                ></button>
                <p className="popup__caption">{props.card? props.card.name : ""}</p>
            </div>
        </div>
    )
}

export default ImagePopup;