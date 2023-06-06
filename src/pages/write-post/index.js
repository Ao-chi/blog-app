import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

// richtext editor
import TextEditor from "@/components/textEditor/textEditor";
import parse from "html-react-parser";

// axios
import axios from "axios";

import Button from "@/components/button/button";
import btn from "../../styles/sass/components/button.module.scss";
import style from "../../styles/blog.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Layout from "../Layout";

import { getSession, useSession } from "next-auth/react";

const WritePost = () => {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        title: "",
        content: "",
    });

    const blogData = {
        title,
        content,
        image: mediaFile,
        author: session?.user.id,
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const handleTitle = (e) => {
        const { name, value } = e.target;
        if (name === "title") {
            setTitle(value);
            setError("");
        }
    };
    const handleMedia = (e) => {
        const imgFile = e.target.files[0];
        setFileToBase(imgFile);
    };

    const setFileToBase = (imgFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onloadend = () => {
            setMediaFile(reader.result);
        };
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        let errors = {};
        setError({
            title: "",
            content: "",
            mediaFile: "",
        });

        if (!title) {
            errors.title = "Title Required";
        }
        if (!content) {
            errors.content = "You haven't written yet";
        }

        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        if (content && title) {
            try {
                // setLoading(true);
                const response = await axios.post("/api/blogs/", blogData);

                if (response.status === 200) {
                    // setLoading(false);

                    setTitle("");
                    setContent("");
                    setMediaFile("");
                    console.log(response);
                }
                // const response = await fetch("/api/blogs/", {
                //     method: "POST",
                //     body: JSON.stringify(blogData),
                //     headers: {
                //         "Content-Type": "aplication/json",
                //     },
                // });
                // setTitle("");
                // setContent("");
                // setMediaFile("");
                // console.log(response);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Required", error);
            // setLoading(false);
        }
    };
    return (
        <Layout>
            <section className={`${style.write_post} ${style.container}`}>
                <div>
                    {/* <h1>What's on your mind?</h1> */}
                    <div>
                        {loading && <span>uploading</span>}
                        <form
                            className={`${style.form_blog} `}
                            onSubmit={handlePublish}
                            // encType="multipart/form-data"
                        >
                            <div className={`${style.form_blog__inputs}`}>
                                <input
                                    className={`${style.form_blog__title}`}
                                    type="text"
                                    name="title"
                                    value={title}
                                    id="blogTitle"
                                    placeholder="Title"
                                    onChange={handleTitle}
                                />
                                {error && <span className={`${style["error-states"]}`}>{error.title}</span>}
                                <TextEditor
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Write something..."
                                />
                                {error && <span className={`${style["error-states"]}`}>{error.content}</span>}
                                <label htmlFor="imageFile">Add Image</label>
                                <input
                                    type="file"
                                    name="imgFile"
                                    id="imageFile"
                                    accept=".jpeg, .png, .jpg"
                                    aria-describedby="fileHelpId"
                                    className={`${style["img-file"]}`}
                                    onChange={handleMedia}
                                />
                                {mediaFile && (
                                    // <Image
                                    //     src={URL.createObjectURL(mediaFile)}
                                    //     width={200}
                                    //     height={200}
                                    //     alt="uploaded image"
                                    // />
                                    <Image src={mediaFile} width={200} height={200} alt="uploaded image" />
                                )}
                                {error && (
                                    <span className={`${style["error-states"]}`}>{error.mediaFile}</span>
                                )}
                            </div>
                            <div className={`${style.button}`}>
                                <Button type="submit" className={`${btn.button} ${style.button__publish}`}>
                                    Publish
                                </Button>
                                <Button type="button" className={`${btn.button}  ${style.button__preview}`}>
                                    Preview
                                    <FontAwesomeIcon
                                        key="icon-preview"
                                        className={`${style["icon-preview"]}`}
                                        icon={faEye}
                                    />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* <div>
                        <h1>{title}</h1>
                    </div> */}
                    {/* <div className="view ql-editor">{parse(content)}</div> */}
                </div>
            </section>
        </Layout>
    );
};

export default WritePost;

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });

    // prevents unauthorized user from accessing post page
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    return {
        props: {
            session,
        },
    };
}
