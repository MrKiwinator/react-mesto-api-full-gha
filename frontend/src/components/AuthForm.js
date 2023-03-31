import React from "react";

export default function AuthForm(props) {
    return(
        <div className="auth__container">
            <h3 className="auth__header">{props.title}</h3>
            <form className="auth__form" onSubmit={props.handleSubmit}>
                <label className="auth__input-field">
                    <input id="email-input" type="email" name="email" className="auth__input auth__input_type_email" placeholder="Email" requiredminlength="2" maxLength="40" required 
                        onChange={props.handleChange}
                        value={props.formValue.email}
                    />
                    <span className="auth__input-error user-email-input-error"></span>
                </label>
                <label className="auth__input-field">
                    <input id="password-input" type="password" name="password" className="auth__input auth__input_type_password" placeholder="Пароль" requiredminlength="5" maxLength="40" required 
                        onChange={props.handleChange}
                        value={props.formValue.password}
                    />
                    <span className="auth__input-error user-email-input-error"></span>
                </label>
                <button type="submit" className="auth__submit">{props.buttonText}</button>
            </form>
        </div>
    )
}