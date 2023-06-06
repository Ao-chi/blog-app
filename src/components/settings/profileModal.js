import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import axios from "axios";
// css
import style from "../../styles/sass/components/modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../button/button";
import Image from "next/image";

const ProfileModal = ({ closeModal }) => {
    const router = useRouter();
    const modalRef = useRef(null);
    const { id } = router.query;
    const { data: session, status, update } = useSession();
    const [isloading, setIsLoading] = useState(true);
    const [inputValues, setInputValues] = useState({
        username: "",
        bio: "",
        image: "",
        location: "",
    });

    // const [isOpen, setIsOpen] = useState(false);
    const handleCloseModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal(false);
        }
    };

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
            setIsLoading(true);
            const res = await axios.patch(`/api/auth/users/${session?.user?.id}`, inputValues);
            // update data on session next auth
            await update({
                ...session,
                user: {
                    ...session?.user,
                    username: inputValues.username,
                    picture: {
                        url: res.data?.image?.url || inputValues.image.url,
                    },
                },
            });
            if (res.status === 201) {
                setInputValues(res.data);
            }

            setIsLoading(false);

            closeModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    // prefills the form modal
    const getData = async () => {
        try {
            setIsLoading(isloading);
            const res = await axios.get(`/api/auth/users/${id}`);

            if (res.status === 201) {
                setInputValues(res.data);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const handleMedia = (e) => {
        const imgFile = e.target.files[0];
        setFileToBase(imgFile);
    };

    const setFileToBase = (imgFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onloadend = () => {
            setInputValues((prevValues) => ({
                ...prevValues,
                image: reader.result,
            }));
        };
    };
    return (
        <>
            <div className={`${style["modal-background"]} `} onClick={handleCloseModal}>
                {!isloading ? (
                    <div className={`${style["modal"]} `} ref={modalRef}>
                        {isloading && <span>saving</span>}
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
                                {inputValues.image?.url ? (
                                    <Image
                                        className={`${style["image-handle"]}`}
                                        src={inputValues.image?.url}
                                        alt="user-profilep-pic"
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <Image
                                        className={`${style["image-handle"]}`}
                                        src={inputValues.image || "/images/user-avatar.png"}
                                        alt="user-profilep-pic"
                                        width={100}
                                        height={100}
                                    />
                                )}

                                <label htmlFor="uploadImage">
                                    Change Profile Photo
                                    <input
                                        type="file"
                                        name="image"
                                        id="uploadImage"
                                        accept=".jpeg, .png, .jpg"
                                        aria-describedby="fileHelpId"
                                        className={`${style["image-input"]}`}
                                        onChange={handleMedia}
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
                                        value={inputValues.username || ""}
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
                                        value={inputValues.bio || ""}
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
                                        value={inputValues.location || ""}
                                        onChange={handleOnchange}
                                    />
                                </label>
                            </div>

                            <div className={`${style["button-container"]}`}>
                                <Button
                                    className={`${style["save-btn"]}`}
                                    type={"submit"}
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <span>loading</span>
                )}
            </div>
        </>
    );
};

export default ProfileModal;
