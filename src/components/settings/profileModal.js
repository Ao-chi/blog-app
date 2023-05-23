import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import axios from "axios";
// css
import style from "../../styles/sass/components/modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../button/button";

const ProfileModal = ({ closeModal }) => {
    const router = useRouter();
    const { settings } = router.query;
    const { data: session, status } = useSession();
    const [inputValues, setInputValues] = useState({
        username: "",
        bio: "",
        location: "",
    });
    // const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get(`/api/auth/users/${session?.user.id}`);
            setInputValues(res.data);
        };

        getData();
    }, [session?.user.id]);

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`/api/auth/users/${session?.user?.id}`, inputValues);

            // console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={`${style["modal-background"]} `}>
            <div className={`${style["modal"]} `}>
                <div className={`${style["modal__header"]}`}>
                    <Button
                        type={"button"}
                        className={`${style.modal__close}`}
                        onClick={() => {
                            closeModal(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </Button>
                    <span> Edit Profile</span>
                </div>
                <form action="" encType="multipart/form-data" className={`${style["profile-form"]}`}>
                    <div className={`${style["image-wrapper"]}`}>
                        <img
                            className={`${style["image-handle"]}`}
                            src="/images/Towa_Ch._3F3F_3j.webp"
                            alt=""
                        />
                        <label htmlFor="uploadImage">
                            Change Profile Photo
                            <input
                                className={`${style["image-input"]}`}
                                type="file"
                                name=""
                                id="uploadImage"
                            />
                        </label>
                    </div>
                    <div className={`${style["profile-form__body"]}`}>
                        <label className={`${style["profile-form__label"]}`} htmlFor="username">
                            Username
                            <input
                                className={`${style["profile-form__input"]}`}
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                value={inputValues.username}
                                onChange={handleOnchange}
                            />
                        </label>
                        <label className={`${style["profile-form__label"]}`} htmlFor="bio">
                            Bio
                            <textarea
                                className={`${style["profile-form__textarea"]}`}
                                type="text"
                                name="bio"
                                id="bio"
                                placeholder="Bio"
                                value={inputValues.bio}
                                onChange={handleOnchange}
                            ></textarea>
                        </label>
                        <label className={`${style["profile-form__label"]}`} htmlFor="location">
                            Location
                            <input
                                className={`${style["profile-form__input"]}`}
                                type="text"
                                name="location"
                                id="location"
                                placeholder="Location"
                                value={inputValues.location}
                                onChange={handleOnchange}
                            />
                        </label>
                    </div>
                    <div className={`${style["button-container"]}`}>
                        <Button
                            className={`${style["save-btn"]}`}
                            type={"submit"}
                            children={"Save"}
                            onClick={handleSave}
                        ></Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
