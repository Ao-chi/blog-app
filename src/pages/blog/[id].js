import React, { useState } from "react";
import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import BlogPost from "@/models/blogPostsModel";

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
import DeleteModal from "@/components/settings/deleteModal";

const Post = ({ blog }) => {
    // console.log(blog);
    const { _id: blogId, title, content, createdAt, updatedAt, image } = blog;
    const { _id: authorId, username, email, bio } = blog.author;

    const date = new Date(createdAt);
    const { data: session, status } = useSession();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDeleteBlog = () => {
        setOpenDeleteModal(!openDeleteModal);
    };

    return (
        <Layout>
            <Head>
                <title>{`${title} / ${username} ${email}`}</title>
                <meta name="og:type" content="article" />
                <meta name="og:description" content={content} />
            </Head>
            <section className={`${style.container}`}>
                {openDeleteModal && (
                    <DeleteModal openModal={setOpenDeleteModal} id={blogId} authorId={authorId}></DeleteModal>
                )}
                <div className={`${style.layout}`}>
                    <section className={`${style["blog-container"]} ${style.blog}`}>
                        <article>
                            {image?.url && (
                                <header className={`${style["article-header"]}`}>
                                    <div className={`${style["article-image"]}`}>
                                        <Image
                                            className={`${style["article-image__cover"]}`}
                                            src={image.url}
                                            width={500}
                                            height={500}
                                            alt="blog image cover"
                                        ></Image>
                                    </div>
                                </header>
                            )}
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
                                    <span>Posted on {date.toDateString()}</span>
                                </div>
                                {session?.user.id === authorId && (
                                    <div className={`${style["edit-area"]}`}>
                                        <Button type={"butotn"} className={`${style["edit-area__edit"]}`}>
                                            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                        </Button>
                                        <Button
                                            type={"button"}
                                            className={`${style["edit-area__delete"]}`}
                                            onClick={handleDeleteBlog}
                                        >
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className={`${style["blog-post"]}`}>
                                <h1 className={`${style["blog-post__title"]}`}>{title}</h1>
                                <div className={`${style["blog-post__content"]}`}>{parse(content)}</div>
                            </div>
                        </article>
                    </section>
                    <aside className={`${style["author-profile"]}`}>
                        <Link href={`/user/${authorId}`}>
                            <div className={`${style["author-profile__profile"]}`}>
                                <Image
                                    className={`${style["author-profile__img"]}`}
                                    src="/images/Tokoyami_Towa_-_Portrait_01.png"
                                    alt="profile"
                                    width={100}
                                    height={100}
                                />
                                <div className={`${style["author-profile__details"]}`}>
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

export default Post;

export async function getStaticProps({ params }) {
    await connectDB();

    // const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/blogs/${params.id}`);
    const data = await BlogPost.findById(`${params.id}`).populate({ path: "author" });

    return {
        props: {
            blog: JSON.parse(JSON.stringify(data)),
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    await connectDB();
    const data = await BlogPost.find({});

    // const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/blogs`);

    const paths = data.map((blogs) => {
        console.log(blogs._id);
        return {
            params: { id: JSON.parse(JSON.stringify(blogs._id)) },
        };
    });

    return {
        paths,
        fallback: false,
    };
}

// export async function getStaticProps({ params }) {
//     const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/blogs/${params.id}`);

//     return {
//         props: {
//             blog: response.data,
//         },
//     };
// }

// export async function getStaticPaths() {
//     const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/blogs`);

//     const paths = res.data.map((blogs) => {
//         return {
//             params: { id: JSON.parse(JSON.stringify(blogs._id)) },
//         };
//     });

//     return {
//         paths,
//         fallback: false,
//     };
// }
