import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
    const [name, setName] = React.useState("");
    const [link, setLink] = React.useState("")

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }
    
    function handleSubmit(e) {
        e.preventDefault();

        props.onAddPlace({
            name,
            link
        })
    }

    return (
        <PopupWithForm name="add-place" title="Новое место" submit={props.submit}
            isOpen={props.isOpen} 
            onClose={props.onClose} 
            onSubmit={handleSubmit} 
            card={props.card}
        >
            <label className="popup__input-field">
                <input id="picture-name-input" type="text" name="name" placeholder="Название" className="popup__input popup__input_type_picture-name" required minLength="2" maxLength="30" 
                value={name} 
                onChange={handleNameChange}  
            />
                <span className="popup__input-error picture-name-input-error"></span>
            </label>
                    
            <label className="popup__input-field">
                <input id="picture-link-input" type="url" name="link" placeholder="Ссылка на картинку" className="popup__input popup__input_type_picture-link" required 
                    value={link} 
                    onChange={handleLinkChange} 
                />
                <span className="popup__input-error picture-link-input-error"></span>
            </label>
        </PopupWithForm>
    )
}