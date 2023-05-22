import axios from "axios";
import { logInStart, logInSuccess, logInError, logOut } from "./authSlice";
import { useRouter } from "next/router";

export const logInUser = async (user, dispatch, setInputErrors, setInputValues, router) => {
    dispatch(logInStart());
    try {
        const response = await axios.post("/api/auth/login", user);

        const { username, email, token } = response.data;
        dispatch(logInSuccess({ username, email, token }));
        localStorage.setItem("token", token);
        setInputValues({
            username: "",
            email: "",
            password: "",
        });
        router.push("/");
        console.log(response.data);
    } catch (error) {
        dispatch(logInError());
        console.log(error);

        if (error.response) {
            // The request was made and the server responded with an error status code
            if (
                error.response.status === 400 &&
                error.response.data.error === "Username or Email not found"
            ) {
                console.log("Email or username not found");
                setInputErrors({ email: error.response.data.error });
            } else {
                setInputErrors({ password: error.response.data.error });
            }
        }
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(logOut());
    localStorage.removeItem("token");
};
