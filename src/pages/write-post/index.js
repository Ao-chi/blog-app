import React from "react";
import { useState, useEffect } from "react";

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
    const [error, setError] = useState({
        title: "",
        content: "",
    });

    const blogData = {
        title,
        content,
        author: session?.user.id,
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        setTitle("");
        setContent("");

        if (!error.title) {
            setError({ title: "Title Required" });
        }

        if (content && title) {
            try {
                const response = await axios.post("/api/blogs/", blogData);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Required", error);
        }
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

    // const handleAuthorName = (e) => {
    //     setAuthorName(e.target.value);
    // };
    // const handleAuthorEmail = (e) => {
    //     setAuthorEmail(e.target.value);
    // };
    return (
        <Layout>
            <section className={`${style.write_post} ${style.container}`}>
                <div>
                    {/* <h1>What's on your mind?</h1> */}
                    <div>
                        <form className={`${style.form_blog} `} onSubmit={handlePublish}>
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
                                {error && <span>{error.title}</span>}
                                <TextEditor
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Write something..."
                                />

                                {/* <input
                                    className={`${style.form_blog__title}`}
                                    type="text"
                                    name="name"
                                    value={authorName}
                                    id="name"
                                    placeholder="Name"
                                    onChange={handleAuthorName}
                                />
                                <input
                                    className={`${style.form_blog__title}`}
                                    type="text"
                                    name="email"
                                    value={authorEmail}
                                    id="email"
                                    placeholder="Email"
                                    onChange={handleAuthorEmail}
                                /> */}
                                <label htmlFor="imageFile">Add Image</label>
                                <input
                                    type="file"
                                    name="imgFile"
                                    id="imageFile"
                                    accept=".jpeg, .png, .jpg"
                                    aria-describedby="fileHelpId"
                                />
                            </div>
                            <div className={`${style.button}`}>
                                <Button
                                    type="submit"
                                    children="Publish"
                                    className={`${btn.button} ${style.button__publish}`}
                                ></Button>
                                <Button
                                    type="button"
                                    children={[
                                        `Preview `,
                                        <FontAwesomeIcon key="icon-preview" icon={faEye} />,
                                    ]}
                                    className={`${btn.button}  ${style.button__preview}`}
                                ></Button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <h1>{title}</h1>
                    </div>
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
