import React from "react";
import Layout from "../Layout";
import Card from "@/components/card/Card";
// import verifyToken from "../../middleware/requireAuth";

// scss
import style from "../../styles/blogs.module.scss";

// database connect

import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import BlogPost from "@/models/blogPostsModel";
import Link from "next/link";

const blog = ({ data }) => {
    // console.log(data);
    return (
        <Layout>
            <section className={`${style.container}`}>
                <div className={`${style["grid-blog"]}`}>
                    {data &&
                        data.map(
                            (
                                {
                                    _id,
                                    title,
                                    author: { _id: authorId, username, email, image: userImage },
                                    image,
                                    createdAt,
                                },
                                index
                            ) => {
                                return (
                                    <div key={_id}>
                                        <Card
                                            id={_id}
                                            title={title}
                                            author={authorId}
                                            username={username}
                                            email={email}
                                            createdAt={createdAt}
                                            image={userImage?.url}
                                        ></Card>
                                    </div>
                                );
                            }
                        )}
                </div>
            </section>
        </Layout>
    );
};

export default blog;

export async function getStaticProps() {
    await connectDB();

    const data = await BlogPost.find({}).sort({ createdAt: -1 }).populate("author");

    return {
        props: {
            data: JSON.parse(JSON.stringify(data)),
        },
    };
}
