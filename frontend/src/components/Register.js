import React from "react";
import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";


export default function Register(props) {    

    return(
        <section className="register">

            <AuthForm 
                handleSubmit={props.handleSubmit} 
                handleChange={props.handleChange} 
                formValue={props.formValue} 
                title={"Регистрация"}
                buttonText={"Зарегистрироваться"}
            />

            <Link to="/sign-in" className="auth__link">Уже зарегистрированы? Войти</Link>

        </section>
    )
}