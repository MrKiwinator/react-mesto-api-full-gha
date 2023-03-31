import React from "react";
import AuthForm from "./AuthForm";

export default function Login(props) {
    
    return(
        <section className="login">

            <AuthForm 
                handleSubmit={props.handleSubmit} 
                handleChange={props.handleChange} 
                formValue={props.formValue}
                title={"Вход"}
                buttonText={"Войти"}
            />

        </section>
    )
}