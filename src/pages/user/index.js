import React from "react";
import Layout from "../Layout";
import connectDB from "@/lib/mongodb";
import User from "../../models/userModel";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

import Card from "@/components/card/Card";
import parse from "html-react-parser";
import style from "../../styles/user.module.scss";

const UserPage = ({ blog }) => {
    console.log(blog);
    const { email, username, _id: authorId } = blog;
    const router = useRouter();

    // if (!router.query.id) {
    //     router.replace(`/user/${authorId}`);
    //     console.log(router.query.id);
    // }
    return (
        <Layout>
            <Head>
                <title>
                    {username} {email}
                </title>
            </Head>
            <section className={`${style.container}`}>
                <div className={`${style.feed}`}>
                    {blog?.blogs ? (
                        blog?.blogs.map(({ _id, title, createdAt }) => {
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
                    ) : (
                        <>
                            <div>
                                <h2> You haven&apos;t posted a blog yet</h2>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default UserPage;

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });
    // console.log(session);
    await connectDB();

    // prevents unauthorized user from accessing post page
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    const data = await User?.findById(session?.user?.id).populate("blogs");

    return {
        props: {
            blog: JSON.parse(JSON.stringify(data)),
        },
    };
}
