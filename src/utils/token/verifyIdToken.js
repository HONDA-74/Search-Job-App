import { OAuth2Client } from "google-auth-library"


export const verifyIdToken = async (idToken) => {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
        idToken ,
        audience: process.env.CLIENT_ID,
    })
    const payload = ticket.getPayload()
    return payload
    }