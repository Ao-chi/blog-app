// import { getToken } from "next-auth/jwt";

// const secret = process.env.NEXTAUTH_SECRET;

// export default async function handler(req, res) {
//     // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
//     // const token = await getToken({ req })
//     const token = await getToken({ req, secret });
//     console.log("JSON Web Token", token);
//     res.end();
// }

// import { getSession } from "next-auth/react";

// export default async (req, res) => {
//     const session = await getSession({ req });
//     if (session) {
//         // Signed in
//         console.log("Session", JSON.stringify(session, null, 2));
//     } else {
//         // Not Signed in
//         res.status(401);
//     }
//     res.end();
// };
