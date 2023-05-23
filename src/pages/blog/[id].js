import React from "react";

import axios from "axios";
import parse from "html-react-parser";
import Layout from "../Layout";
import Head from "next/head";

// css
import style from "../../styles/single-blog.module.scss";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button/button";
import Image from "next/image";

const BlogPost = ({ blog }) => {
    // console.log(blog);
    const { title, content, createdAt, updatedAt } = blog;
    const { _id: authorId, username, email, bio } = blog.author;

    const date = new Date(createdAt);
    const { data: session, status } = useSession();

    return (
        <Layout>
            <Head>
                <title>
                    {title} / {username} {email}
                </title>
                <meta name="og:type" content="article" />
                <meta name="og:description" content={content} />
            </Head>
            <section className={`${style.container}`}>
                <div className={`${style.layout}`}>
                    <section className={`${style["blog-container"]} ${style.blog}`}>
                        <article>
                            <header className={`${style.profile}`}>
                                <Image
                                    className={`${style.profile__img}`}
                                    src="/images/Tokoyami_Towa_-_Portrait_01.png"
                                    alt="profile"
                                    width={100}
                                    height={100}
                                />
                                <div className={`${style.profile__details}`}>
                                    <p>{username}</p>
                                    <span>Posted on {date.toDateString()}</span>
                                </div>
                                {session?.user.id === authorId && (
                                    <div className={`${style["edit-area"]}`}>
                                        <Button type={"butotn"} className={`${style["edit-area__edit"]}`}>
                                            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                        </Button>
                                        <Button type={"button"} className={`${style["edit-area__delete"]}`}>
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </Button>
                                    </div>
                                )}
                            </header>
                            <div>
                                <h1>{title}</h1>
                                <div>{parse(content)}</div>
                            </div>
                        </article>
                    </section>
                    <aside className={`${style["author-profile"]}`}>
                        <Link href={`/user/${authorId}`}>
                            <div className={`${style.profile}`}>
                                <Image
                                    className={`${style.profile__img}`}
                                    src="/images/Tokoyami_Towa_-_Portrait_01.png"
                                    alt="profile"
                                    width={100}
                                    height={100}
                                />
                                <div className={`${style.profile__details}`}>
                                    <p>{username}</p>
                                    <span>{email}</span>
                                </div>
                            </div>
                        </Link>
                        <div>
                            <p>{bio}</p>
                        </div>
                    </aside>
                </div>
            </section>
        </Layout>
    );
};

export default BlogPost;

export async function getStaticProps({ params }) {
    const response = await axios.get(`http://localhost:3000/api/blogs/${params.id}`);

    return {
        props: {
            blog: response.data,
        },
    };
}

export async function getStaticPaths() {
    const res = await axios.get("http://localhost:3000/api/blogs");

    const paths = res.data.map((blogs) => {
        return {
            params: { id: JSON.parse(JSON.stringify(blogs._id)) },
        };
    });

    return {
        paths,
        fallback: false,
    };
}
