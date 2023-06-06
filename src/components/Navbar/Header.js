import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { currentToken, currentUser, isLoggedIn, logOut } from "@/features/auth/authSlice";
import { logoutUser } from "@/features/auth/apiCall";

//next-auth
import { signOut, useSession, getSession } from "next-auth/react";

// css
import style from "../../styles/sass/components/header.module.scss";
import Login from "@/pages/login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Button from "../button/button";
import Image from "next/image";
import Dropdown from "../dropdown/Dropdown";
import useClickOutside from "@/hooks/useClickOutside";

const Navbar = () => {
    const { data: session, status, update } = useSession();
    // console.log(session);
    const dropdownRef = useRef(null);

    // const token = useSelector(currentToken);
    // const loggedIn = useSelector(isLoggedIn);
    // const dispatch = useDispatch();
    const router = useRouter();

    const handleLog = (e) => {
        e.preventDefault();
        // dispatch(logoutUser());
        signOut({ callbackUrl: "/" });
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // custom hook for dropdown menus
    // useClickOutside(dropdownRef, () => {
    //     setIsOpen(false);
    // });
    const setActiveRef = useClickOutside(dropdownRef, () => {
        setIsOpen(false);
    });

    const handleUserLinkClick = (e) => {
        // Check if current URL is user page
        const isUserPage = router.pathname === "/user";

        e.preventDefault();
        setIsOpen(false);
        if (!isUserPage) {
            router.push(`/user/${session?.user?.id}`);
        }
    };
    return (
        <header className={`${style.header}`}>
            <nav className={`${style.navbar} ${style.container}`}>
                <div className={`${style.logo}`}>
                    <Link href="/">
                        <svg
                            width="429"
                            height="86"
                            viewBox="0 0 429 86"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M35.288 60.536C31.96 60.536 28.6747 59.9387 25.432 58.744C22.2747 57.464 19.6293 55.672 17.496 53.368L18.008 48.12V85.88H0.216001V1.784H15.576L18.136 12.664L16.728 8.824C19.6293 6.34933 22.872 4.30133 26.456 2.68C30.04 1.05866 34.1787 0.247997 38.872 0.247997C44.0773 0.247997 48.728 1.48533 52.824 3.96C56.92 6.34933 60.12 9.848 62.424 14.456C64.8133 18.9787 66.008 24.44 66.008 30.84C66.008 37.1547 64.6853 42.5307 62.04 46.968C59.3947 51.4053 55.768 54.776 51.16 57.08C46.552 59.384 41.2613 60.536 35.288 60.536ZM31.704 46.456C34.6053 46.456 37.2507 45.816 39.64 44.536C42.1147 43.256 44.0773 41.464 45.528 39.16C47.064 36.7707 47.832 34.0827 47.832 31.096C47.832 27.9387 47.1493 25.208 45.784 22.904C44.504 20.5147 42.712 18.68 40.408 17.4C38.1893 16.0347 35.7147 15.352 32.984 15.352C30.5947 15.352 28.4613 15.6933 26.584 16.376C24.792 16.9733 23.1707 17.912 21.72 19.192C20.3547 20.3867 19.16 21.9227 18.136 23.8V37.496C18.8187 39.288 19.8 40.8667 21.08 42.232C22.36 43.5973 23.896 44.664 25.688 45.432C27.5653 46.1147 29.5707 46.456 31.704 46.456ZM98.651 60.536C91.8243 60.536 86.0217 59.256 81.243 56.696C76.5497 54.136 72.9657 50.5947 70.491 46.072C68.0163 41.5493 66.779 36.344 66.779 30.456C66.779 24.824 68.2297 19.7467 71.131 15.224C74.0323 10.7013 77.915 7.11733 82.779 4.472C87.643 1.74133 93.0617 0.375996 99.035 0.375996C107.056 0.375996 113.627 2.72266 118.747 7.416C123.952 12.024 127.323 18.7227 128.859 27.512L85.339 41.336L81.371 31.608L112.859 20.984L109.147 22.648C108.464 20.4293 107.227 18.5093 105.435 16.888C103.728 15.1813 101.126 14.328 97.627 14.328C94.9817 14.328 92.635 14.968 90.587 16.248C88.6243 17.4427 87.0883 19.192 85.979 21.496C84.955 23.7147 84.443 26.36 84.443 29.432C84.443 32.9307 85.083 35.8747 86.363 38.264C87.643 40.568 89.3923 42.3173 91.611 43.512C93.8297 44.7067 96.3043 45.304 99.035 45.304C100.998 45.304 102.875 44.9627 104.667 44.28C106.544 43.5973 108.379 42.7013 110.171 41.592L118.107 54.904C115.12 56.6107 111.878 57.976 108.379 59C104.966 60.024 101.723 60.536 98.651 60.536ZM149.177 3.064L150.585 13.048L150.329 12.152C152.292 8.65333 155.065 5.83733 158.649 3.704C162.233 1.48533 166.628 0.375996 171.833 0.375996C177.124 0.375996 181.518 1.95466 185.017 5.112C188.601 8.184 190.436 12.1947 190.521 17.144V59H172.601V23.8C172.516 21.3253 171.833 19.3627 170.553 17.912C169.358 16.376 167.31 15.608 164.409 15.608C161.678 15.608 159.289 16.504 157.241 18.296C155.193 20.088 153.614 22.52 152.505 25.592C151.396 28.664 150.841 32.2053 150.841 36.216V59H132.921V3.064H149.177ZM216.217 3.064L217.625 12.92L217.369 12.152C219.588 8.39733 222.361 5.496 225.689 3.448C229.017 1.31466 233.028 0.247997 237.721 0.247997C240.793 0.247997 243.481 0.674664 245.785 1.528C248.174 2.38133 250.18 3.66133 251.801 5.368C253.422 6.98933 254.532 9.12267 255.129 11.768L254.489 11.896C256.878 8.39733 259.737 5.58133 263.065 3.448C266.478 1.31466 270.02 0.247997 273.689 0.247997C279.236 0.247997 283.63 1.82666 286.873 4.984C290.201 8.056 291.908 12.0667 291.993 17.016V59H274.201V24.44C274.116 21.9653 273.732 19.96 273.049 18.424C272.366 16.8027 270.788 15.9067 268.313 15.736C265.412 15.736 262.937 16.76 260.889 18.808C258.926 20.7707 257.433 23.3307 256.409 26.488C255.47 29.56 255.001 32.76 255.001 36.088V59H237.081V24.44C236.996 21.9653 236.526 19.96 235.673 18.424C234.905 16.8027 233.284 15.9067 230.809 15.736C227.993 15.736 225.604 16.76 223.641 18.808C221.764 20.7707 220.313 23.288 219.289 26.36C218.35 29.432 217.881 32.5893 217.881 35.832V59H199.961V3.064H216.217ZM325.053 60.536C319.848 60.536 315.112 59.512 310.845 57.464C306.664 55.3307 303.336 52.088 300.861 47.736C298.386 43.384 297.149 37.8373 297.149 31.096C297.149 24.7813 298.429 19.32 300.989 14.712C303.549 10.104 306.92 6.56267 311.101 4.088C315.282 1.528 319.72 0.247997 324.413 0.247997C329.96 0.247997 334.141 1.18666 336.957 3.064C339.858 4.856 342.248 6.86133 344.125 9.08L343.357 11.256L345.021 3.064H361.661V59H343.741V46.84L345.149 50.68C344.978 50.68 344.466 51.192 343.613 52.216C342.76 53.1547 341.48 54.3067 339.773 55.672C338.152 56.952 336.104 58.0613 333.629 59C331.24 60.024 328.381 60.536 325.053 60.536ZM330.173 45.944C332.306 45.944 334.226 45.6453 335.933 45.048C337.64 44.3653 339.133 43.4267 340.413 42.232C341.693 40.952 342.802 39.3733 343.741 37.496V23.8C343.058 21.9227 342.034 20.344 340.669 19.064C339.304 17.6987 337.682 16.6747 335.805 15.992C333.928 15.224 331.837 14.84 329.533 14.84C326.973 14.84 324.584 15.5227 322.365 16.888C320.232 18.168 318.525 19.96 317.245 22.264C315.965 24.568 315.325 27.2133 315.325 30.2C315.325 33.1867 316.008 35.8747 317.373 38.264C318.738 40.6533 320.53 42.5307 322.749 43.896C325.053 45.2613 327.528 45.944 330.173 45.944ZM387.422 3.064L388.83 13.048L388.574 12.152C390.537 8.65333 393.31 5.83733 396.894 3.704C400.478 1.48533 404.873 0.375996 410.078 0.375996C415.369 0.375996 419.763 1.95466 423.262 5.112C426.846 8.184 428.681 12.1947 428.766 17.144V59H410.846V23.8C410.761 21.3253 410.078 19.3627 408.798 17.912C407.603 16.376 405.555 15.608 402.654 15.608C399.923 15.608 397.534 16.504 395.486 18.296C393.438 20.088 391.859 22.52 390.75 25.592C389.641 28.664 389.086 32.2053 389.086 36.216V59H371.166V3.064H387.422Z"
                                fill="black"
                            />
                        </svg>
                    </Link>
                </div>
                <ul className={`${style.nav_menu}`}>
                    <li className={style.navmenu__list}>
                        <Link className={`${style.navmenu__items}`} href="/">
                            Home
                        </Link>
                    </li>

                    <li className={style.nav_menu__list}>
                        <Link className={`${style.navmenu__items}`} href="/blog">
                            Blogs
                        </Link>
                    </li>
                </ul>

                <ul
                    className={`${style.auth_menu} ${
                        !session && status === "loading" ? style.loading : style.loaded
                    } `}
                >
                    {!session?.user && (
                        <>
                            <li className={style.auth_menu__list}>
                                <Link
                                    className={`${style.auth_menu__items} ${style["log-in"]}`}
                                    href="/login"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li className={style.auth_menu__list}>
                                <Link
                                    className={`${style.auth_menu__items} ${style["sign-up"]} 
                                    `}
                                    href="/signup"
                                >
                                    Sign up
                                </Link>
                            </li>
                        </>
                    )}

                    <li className={style.auth_menu__list}>
                        {session?.user?.id && (
                            <div className={`${style.dropdown}`} ref={setActiveRef}>
                                <div className={`${style.profile}`}>
                                    <Button className={`${style.button} ${style["write-post"]}`}>
                                        <Link
                                            className={`${style["dropdown-menu__item"]} `}
                                            href="/write-post"
                                        >
                                            <FontAwesomeIcon
                                                className={`${style.icon}`}
                                                icon={faPen}
                                            ></FontAwesomeIcon>{" "}
                                            Write
                                        </Link>
                                    </Button>
                                    <button
                                        className={`${style["profile-btn"]} ${style.button}`}
                                        type="button"
                                        id="prfileId"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        onClick={handleDropdown}
                                    >
                                        <div className={`${style["img-container"]}`}>
                                            <Image
                                                src={session.user?.picture.url}
                                                alt="towa"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                    </button>
                                </div>

                                <Dropdown
                                    className={`${style["dropdown-menu"]} ${
                                        isOpen ? style.open : style.close
                                    }`}
                                >
                                    <div className={`${style["account-header"]}`}>
                                        <Link
                                            className={`${style["dropdown-menu__item"]} `}
                                            href={`/user/${session?.user?.username}`}
                                            passHref
                                            onClick={handleUserLinkClick}
                                        >
                                            <div className={`${style["img-container"]}`}>
                                                <Image
                                                    src={session.user?.picture.url}
                                                    alt="towa"
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>

                                            <div>
                                                <span>{session?.user?.username}</span>
                                                <span className={`${style}`}>{session.user.email}</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className={`${style["dropdown-menu__body"]}`}>
                                        <Link
                                            className={`${style["dropdown-menu__item"]}  ${style.link} `}
                                            href="/write-post"
                                        >
                                            <FontAwesomeIcon
                                                className={`${style.icon}`}
                                                icon={faPen}
                                            ></FontAwesomeIcon>{" "}
                                            Write Post
                                        </Link>
                                        <Link
                                            className={`${style["dropdown-menu__item"]} ${style.link}`}
                                            href="/"
                                            onClick={handleLog}
                                        >
                                            <FontAwesomeIcon
                                                className={`${style.icon}`}
                                                icon={faSignOut}
                                            ></FontAwesomeIcon>{" "}
                                            Log out
                                        </Link>
                                    </div>
                                </Dropdown>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
