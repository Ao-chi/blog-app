import React, { useRef, useEffect } from "react";

// css
import style from "../../styles/sass/components/dropdown.module.scss";

const Dropdown = ({ children, className = "" }) => {
    // const dropdownRef = useRef(null);

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //             // console.log("click out");
    //             closeDropdown(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [dropdownRef]);

    return (
        <div className={`${style["dropdown-menu"]} ${className}`}>
            <div>{children}</div>
        </div>
    );
};

export default Dropdown;
