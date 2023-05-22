import React from "react";

const Button = ({ type, onClick, children, className = "", ariaLabel }) => {
    const handleClick = onClick || (() => {});
    return (
        <button className={className} type={type} aria-label={ariaLabel} onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;
