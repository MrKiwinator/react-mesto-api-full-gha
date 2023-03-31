function PopupWithForm(props) {
    return (
        <div className={`popup ${props.name} ${props.isOpen && "popup_opened"}`}>
            <div className="popup__container">
                <form className="popup__form" noValidate
                    name={props.name} 
                    onSubmit={props.onSubmit}
                >
                    <h3 className="popup__title">{props.title}</h3>
                                
                    {/* FORM FIELDS */} 
                    {props.children}
        
                    <button type="submit" className="popup__submit">{props.submit}</button>
                </form>
                <button aria-label="Закрыть" type="button" className="popup__close-btn" 
                    onClick={props.onClose}
                ></button>
            </div>
        </div>
    )
}

export default PopupWithForm;