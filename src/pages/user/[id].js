import React from "react";

import { useState } from "react";

import axios from "axios";
import Link from "next/link";
import Layout from "../Layout";
import Card from "@/components/card/Card";
import style from "../../styles/user.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";
import ProfileModal from "@/components/settings/profileModal";
import Button from "@/components/button/button";
import Head from "next/head";
import Image from "next/image";

const SingleUser = ({ blog }) => {
    // console.log(blog);
    const { email, username, _id: authorId, bio } = blog.author;
    const { data: session, status } = useSession();
    // console.log(session);
    const profile = "profile";
    const [openModal, setOpenModal] = useState(false);

    return (
        <Layout>
            <Head>
                <title>
                    {username} {email}
                </title>
            </Head>
            <section className={`${style.container}`}>
                <div className={`${style["profile-wrapper"]}`}>
                    <header className={`${style["profile-header"]}`}>
                        <div className={`${style["profile-header__avatar"]}`}>
                            <span className={`${style.image}`}>
                                <Image
                                    src="/images/Towa_Ch._3F3F_3j.webp"
                                    alt="user-profile-image"
                                    width={100}
                                    height={100}
                                />
                            </span>
                        </div>
                        <div className={`${style["edit-profile"]}`}>
                            {session?.user.id !== authorId ? (
                                <Link href="" className={`${style["edit-profile__btn"]}`}>
                                    Follow
                                </Link>
                            ) : (
                                <Button
                                    className={`${style["edit-profile__btn"]} `}
                                    type={"button"}
                                    onClick={() => {
                                        setOpenModal(!openModal);
                                    }}
                                >
                                    Edit profile
                                </Button>
                            )}
                        </div>
                        <div className={`${style["profile-header__body"]}`}>
                            <span className={`${style["profile-header__username"]}`}>{username}</span>
                            <span className={`${style["profile-header__email"]}`}>
                                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon> {email}
                            </span>

                            <p>{bio}</p>
                        </div>
                    </header>
                </div>
                {openModal && <ProfileModal closeModal={setOpenModal} />}
                <div className={`${style.feed}`}>
                    {!blog.author?.blogs ? (
                        <>
                            <div>
                                <h2> You haven&apos;t posted a blog yet</h2>
                            </div>
                        </>
                    ) : (
                        blog.author?.blogs.map(({ _id, title, createdAt }) => {
                            return (
                                <div key={_id}>
                                    <Card
                                        id={_id}
                                        title={title}
                                        author={authorId}
                                        username={username}
                                        email={email}
                                        createdAt={createdAt}
                                    ></Card>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default SingleUser;

export async function getStaticProps({ params }) {
    const response = await axios.get(`http://localhost:3000/api/blogs/author/${params.id}`);
    // console.log(response.data);
    return {
        props: {
            blog: response.data,
        },
    };
}

export async function getStaticPaths() {
    const res = await axios.get("http://localhost:3000/api/blogs");

    const paths = res.data.map((blogs) => {
        console.log(blogs);
        return {
            params: { id: JSON.parse(JSON.stringify(blogs.author._id)) },
        };
    });

    return {
        paths,
        fallback: false,
    };
}
