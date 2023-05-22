import React from "react";

// css
import style from "../../styles/sass/components/_card.module.scss";
import Link from "next/link";

const Card = ({ id, title, author, email, username, createdAt }) => {
    // console.log(info);
    const date = new Date(createdAt);

    return (
        <div className={`${style.card}`}>
            <div>
                <Link href={`/user/${author}`}>
                    <div className={`${style.card__profile} `}>
                        <img className={`${style.card__img}`} src="/images/Towa_Ch._3F3F_3j.webp" alt="" />
                        <div>
                            <p className={`${style.card__user}`}>{username}</p>
                            <p className={`${style.card__email}`}>{email}</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="card__image">
                <img src="" alt="" />
            </div>
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
