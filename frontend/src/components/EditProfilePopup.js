import React from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

export default function EditProfilePopup(props) {
    // Hooks
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        if (props.isOpen) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [currentUser, props.isOpen]); 

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateUser({
            name,
            about: description,
        })
    }

    return (
        <PopupWithForm name="edit-profile" title="Редактировать профиль" submit={props.submit} 
            isOpen={props.isOpen} 
            onClose={props.onClose} 
            onSubmit={handleSubmit}
        >
            <label className="popup__input-field">
                <input id="username-input" type="text" name="user_name" className="popup__input popup__input_type_username" placeholder="Имя пользователя" requiredminlength="2" maxLength="40" 
                    onChange={handleNameChange} 
                    value={name} 
                />
                <span className="popup__input-error username-input-error"></span>
            </label>

            <label className="popup__input-field">
                <input id="user-status-input" type="text" name="user_status" className="popup__input popup__input_type_userstatus" placeholder="Занятие" requiredminlength="2" maxLength="200" 
                    onChange={handleDescriptionChange} 
                    value={description} 
                />
                <span className="popup__input-error user-status-input-error"></span>
            </label>
        </PopupWithForm>
    )
}