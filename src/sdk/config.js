// Elements
const host = "https://sme-dev.vdc2.com.vn"
const userID = "user1"
const device = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6ImNybV9hcHAiLCJleHAiOjE2MjEzNTUwNzEsInVzZXJJRCI6InVzZXIxIn0.2LEki1wyxtVUJqr2wFGamwD_zMGY5yLkEeh9V_LuT7E"
}
const centrifugoServer = "wss://sme-dev.vdc2.com.vn"
const centrifugeJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2dWUtc2RrIn0.rqqFBcGquJJL68qrdEIFHbVv9SIjSLCfcnafNGx1T0M"

// Create a new Config
const config = new Object({
    host: host,
    userID: userID,
    device: device,
    centrifugoServer: centrifugoServer,
    centrifugeJWT: centrifugeJWT
})

// Export config file
export default config