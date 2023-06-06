import { useEffect, useRef } from "react";

const useClickOutside = (ref, callback) => {
    const activeRef = useRef(null); // Ref to track the active dropdown

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeRef.current && !activeRef.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [callback]);

    const setActiveRef = (elementRef) => {
        activeRef.current = elementRef;
    };

    return setActiveRef;
};

export default useClickOutside;

// import { useEffect } from "react";

// const useClickOutside = (ref, callback) => {
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 // console.log("click out");
//                 callback();
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [ref.current, callback]);
// };

// export default useClickOutside;
