import React from "react";
import successIcon from "../images/success-icon.svg";
import failIcon from "../images/fail-icon.svg"

export default function InfoTooltip (props) {
    return (
        <div className={`info-tooltip ${props.isOpen && "info-tooltip_opened" }`}>
            <div className="info-tooltip__container">
                {
                    props.tooltipStatus === "success" ?
                    <>
                        <img className="info-tooltip__icon" src={successIcon} alt="Успешно" />
                        <p className="info-tooltip__text">Вы успешно зарегистрировались!</p>
                    </>
                     :
                    (props.tooltipStatus || props.loginStatus) === "failed" &&
                    <>
                        <img className="info-tooltip__icon" src={failIcon} alt="Не удалось" />
                        <p className="info-tooltip__text">Что-то пошло не так! Попробуйте ещё раз.</p>
                    </>
                    
                }
                <button aria-label="Закрыть" type="button" className="info-tooltip__close-btn" 
                    onClick={props.onClose}
                ></button>
            </div>
        </div>
    )
}