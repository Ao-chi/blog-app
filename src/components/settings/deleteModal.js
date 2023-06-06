import React from "react";
import Button from "../button/button";
import style from "../../styles/sass/components/deleteModal.module.scss";
import button from "../../styles/sass/components/button.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { useRouter } from "next/router";

const DeleteModal = ({ openModal, id, authorId }) => {
    const router = useRouter();

    const handleDeletePost = async () => {
        try {
            const res = await axios.delete(`/api/blogs/${id}`);

            if (res.status === 200) {
                console.log(id);
                router.push(`/user/${authorId}`);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div
                className={`${style["modal-overlay"]}`}
                onClick={() => {
                    openModal(false);
                }}
            >
                <div
                    className={`${style.modal}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={`${style.modal__header}`}>
                        <div>
                            <p>Delete post?</p>
                        </div>
                        <span>
                            This can&apos;t be undone, and by deleting this post it will be removed from your
                            profile and other people&apos;s feeds.
                        </span>
                    </div>

                    <div>
                        <Button
                            type={"button"}
                            className={`${button.button} ${style.button}`}
                            onClick={handleDeletePost}
                        >
                            Delete
                        </Button>
                        <Button
                            type={"button"}
                            className={`${button.button} ${style.button}`}
                            onClick={() => {
                                openModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
