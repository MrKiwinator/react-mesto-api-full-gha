import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {

    const avatarRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateAvatar({
            avatar: avatarRef.current.value,
        })
    }

    return (
        <PopupWithForm name="edit-avatar" title="Обновить аватар" submit={props.submit}
            isOpen={props.isOpen} 
            onClose={props.onClose} 
            onSubmit={handleSubmit}
        >
            <label className="popup__input-field">
                <input id="avatar-link-input" type="url" name="user_avatar" placeholder="Ссылка на картинку" className="popup__input popup__input_type_picture-link" required 
                    ref={avatarRef} 
                />
                <span className="popup__input-error avatar-link-input-error"></span>
            </label>
        </PopupWithForm>
    )
}