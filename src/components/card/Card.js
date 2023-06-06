import React, { useState, useRef } from "react";

// css
import style from "../../styles/sass/components/_card.module.scss";
import dropdown from "../../styles/sass/components/dropdown.module.scss";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEllipsis, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Button from "../button/button";
import Dropdown from "../dropdown/Dropdown";
import { useSession } from "next-auth/react";
import { faFlag, faUser } from "@fortawesome/free-regular-svg-icons";
import useClickOutside from "@/hooks/useClickOutside";

const Card = ({ id, title, author, email, username, image, createdAt }) => {
    // console.log(info);
    const date = new Date(createdAt);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const setActiveRef = useClickOutside(dropdownRef, () => {
        setIsOpen(false);
    });

    return (
        <div className={`${style.card}`}>
            <div className={`${style.card__header}`}>
                <Link href={`/user/${author}`}>
                    <div className={`${style.card__profile} `}>
                        <div className={`${style["card__img-container"]}`}>
                            <div className={`${style["img-overlay"]}`}></div>
                            <Image
                                className={`${style.card__img}`}
                                src={image}
                                alt="user-image"
                                width={100}
                                height={100}
                            />
                        </div>

                        <div>
                            <p className={`${style.card__user}`}>{username}</p>
                            <p className={`${style.card__email}`}>{email}</p>
                        </div>
                    </div>
                </Link>
                <div className={`${style.ellipsis}`} ref={setActiveRef}>
                    <div>
                        <Button type={"button"} className={`${style.ellipsis__btn}`} onClick={handleDropdown}>
                            <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
                        </Button>
                        {isOpen && (
                            <Dropdown className={`${style["dropdown-menu"]}`}>
                                {session.user.id === author ? (
                                    <>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className={`${dropdown["dropdown-item"]}`}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                            <span>Delete Post</span>
                                        </div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className={`${dropdown["dropdown-item"]}`}
                                        >
                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                            <span>Edit Post</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className={`${dropdown["dropdown-item"]}`}
                                        >
                                            <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                                            <span>Follow {username}</span>
                                        </div>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className={`${dropdown["dropdown-item"]}`}
                                        >
                                            <FontAwesomeIcon icon={faFlag}></FontAwesomeIcon>
                                            <span>Report Post</span>
                                        </div>
                                    </>
                                )}
                            </Dropdown>
                        )}
                    </div>
                </div>
            </div>
            <div className="card__image">{/* <Image src="" alt="" width={100} height={100} /> */}</div>
            <div className={`${style.card__body}`}>
                <Link href={`/blog/${id}`} key={id}>
                    <h2 className={`${style.card__title}`}>{title}</h2>
                </Link>
                <p className={`${style.card__date}`}>{date?.toDateString()}</p>
            </div>
        </div>
    );
};

export default Card;
