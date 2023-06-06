// import React from "react";

// import { useState } from "react";

// import axios from "axios";
// import Link from "next/link";
// import Layout from "../Layout";
// import Card from "@/components/card/Card";
// import style from "../../styles/user.module.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
// import { useSession } from "next-auth/react";
// import ProfileModal from "@/components/settings/profileModal";
// import Button from "@/components/button/button";
// import Head from "next/head";
// import Image from "next/image";

// const SingleUser = ({ blog }) => {
//     // console.log(blog);
//     const { email, username, _id: authorId, bio } = blog.author;
//     const { data: session, status } = useSession();
//     // console.log(session);
//     const profile = "profile";
//     const [openModal, setOpenModal] = useState(false);

//     return (
//         <Layout>
//             <Head>
//                 <title>
//                     {username} {email}
//                 </title>
//             </Head>
//             <section className={`${style.container}`}>
//                 <div className={`${style["profile-wrapper"]}`}>
//                     <header className={`${style["profile-header"]}`}>
//                         <div className={`${style["profile-header__avatar"]}`}>
//                             <span className={`${style.image}`}>
//                                 <Image
//                                     src="/images/Towa_Ch._3F3F_3j.webp"
//                                     alt="user-profile-image"
//                                     width={100}
//                                     height={100}
//                                 />
//                             </span>
//                         </div>
//                         <div className={`${style["edit-profile"]}`}>
//                             {session?.user.id !== authorId ? (
//                                 <Link href="" className={`${style["edit-profile__btn"]}`}>
//                                     Follow
//                                 </Link>
//                             ) : (
//                                 <Button
//                                     className={`${style["edit-profile__btn"]} `}
//                                     type={"button"}
//                                     onClick={() => {
//                                         setOpenModal(!openModal);
//                                     }}
//                                 >
//                                     Edit profile
//                                 </Button>
//                             )}
//                         </div>
//                         <div className={`${style["profile-header__body"]}`}>
//                             <span className={`${style["profile-header__username"]}`}>{username}</span>
//                             <span className={`${style["profile-header__email"]}`}>
//                                 <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon> {email}
//                             </span>

//                             <p>{bio}</p>
//                         </div>
//                     </header>
//                 </div>
//                 {openModal && <ProfileModal closeModal={setOpenModal} />}
//                 <div className={`${style.feed}`}>
//                     {!blog.author?.blogs ? (
//                         <>
//                             <div>
//                                 <h2> You haven&apos;t posted a blog yet</h2>
//                             </div>
//                         </>
//                     ) : (
//                         blog.author?.blogs.map(({ _id, title, createdAt }) => {
//                             return (
//                                 <div key={_id}>
//                                     <Card
//                                         id={_id}
//                                         title={title}
//                                         author={authorId}
//                                         username={username}
//                                         email={email}
//                                         createdAt={createdAt}
//                                     ></Card>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </section>
//         </Layout>
//     );
// };

// export default SingleUser;

// export async function getStaticProps({ params }) {
//     const response = await axios.get(`http://localhost:3000/api/blogs/author/${params.id}`);
//     console.log(response.data);
//     return {
//         props: {
//             blog: response.data,
//         },
//     };
// }

// export async function getStaticPaths() {
//     const res = await axios.get("http://localhost:3000/api/blogs");

//     const paths = res.data.map((blogs) => {
//         // console.log(blogs);
//         return {
//             params: { id: JSON.parse(JSON.stringify(blogs.author._id)) },
//         };
//     });

//     return {
//         paths,
//         fallback: false,
//     };
// }
// import React from "react";

import { useState, useEffect } from "react";
import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import BlogPost from "@/models/blogPostsModel";

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
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const SingleUser = ({ blog }) => {
    // console.log(blog);
    const { data: session, status, update } = useSession();

    const {
        email = "",
        username = "",
        _id: authorId = "",
        bio = "",
        location = "",
        blogs = [],
        image: { public_id = "", url = "" } = {},
    } = blog || {};
    const [openModal, setOpenModal] = useState(false);
    const [userDetail, setUserDetail] = useState({
        email,
        username,
        authorId,
        bio,
        location,
        image: {
            public_id,
            url,
        },
    });

    const {
        email: userEmail,
        username: userName,
        authorId: userAuthorid,
        bio: userBio,
        location: userLocation,
        image: { public_id: userPublicID, url: userUrl },
    } = userDetail;

    const handleModalClose = async () => {
        setOpenModal(false);
        try {
            const res = await axios.get(`/api/auth/users/${authorId}`);

            setUserDetail(res.data);

            // console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <Head>
                <title>{`${username} ${email}`}</title>
            </Head>
            <section className={`${style.container}`}>
                <div className={`${style["profile-wrapper"]}`}>
                    <header className={`${style["profile-header"]}`}>
                        <div className={`${style["profile-header__avatar"]}`}>
                            <span className={`${style.image}`}>
                                {url ? (
                                    <Image src={url} alt="user-profile-image" width={100} height={100} />
                                ) : (
                                    <Image
                                        src="/images/user-avatar.png"
                                        alt="user-profile-image"
                                        width={100}
                                        height={100}
                                    />
                                )}
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
                            {session?.user?.id === authorId ? (
                                <>
                                    <span className={`${style["profile-header__username"]}`}>
                                        {session?.user?.username}
                                    </span>
                                    <div className={`${style["other-details"]}`}>
                                        <p className={`${style["other-details__item"]}`}>
                                            <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>{" "}
                                            <span>{email}</span>
                                        </p>
                                        {location && (
                                            <p className={`${style["other-details__item"]}`}>
                                                <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                                                <span>{location}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className={`${style["profile-header__bio"]}`}>
                                        <p>{bio}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={`${style["profile-header__username"]}`}>{userName}</span>
                                    <div className={`${style["other-details"]}`}>
                                        <p className={`${style["other-details__item"]}`}>
                                            <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>{" "}
                                            <span>{userEmail}</span>
                                        </p>
                                        {location && (
                                            <p className={`${style["other-details__item"]}`}>
                                                <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                                                <span>{userLocation}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className={`${style["profile-header__bio"]}`}>
                                        <p>{userBio}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </header>
                </div>
                {/* Modal */}
                {openModal && <ProfileModal closeModal={handleModalClose} />}
                <div className={`${style.feed}`}>
                    {blog?.blogs?.length === 0 ? (
                        <>
                            <div className={`${style["feed__no-post"]}`}>
                                <h2> You haven&apos;t posted a blog yet</h2>
                            </div>
                        </>
                    ) : (
                        blog?.blogs?.map(({ _id, title, createdAt }) => {
                            return (
                                <div key={_id}>
                                    <Card
                                        id={_id}
                                        title={title}
                                        author={authorId}
                                        username={username}
                                        email={email}
                                        createdAt={createdAt}
                                        image={url}
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
    // const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs/author/${params.id}`);
    await connectDB();

    const data = await User.findById(`${params?.id}`).populate("blogs");
    // const data = await User.where("username").equals(`${params?.id}`).populate("blogs");

    // console.log(data);

    return {
        props: {
            blog: JSON.parse(JSON.stringify(data)),
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    // const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs`);
    // const data = await res.json();
    await connectDB();

    const data = await BlogPost.find({});

    const paths = data.map((blogs) => {
        console.log(blogs);
        return {
            params: { id: JSON.parse(JSON.stringify(blogs?.author._id)) },
            // params: { id: JSON.parse(JSON.stringify(blogs?.author.username)) },
        };
    });

    return {
        paths,
        fallback: true,
    };
}
