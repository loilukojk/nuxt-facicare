// Elements
const device = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6InZ1ZXNka19zYW1wbGVfYXBwIiwiZXhwIjoxNjEyNjY0OTMwLCJ1c2VySUQiOiJ1c2VyMSJ9.AKjS-mJDZ304cGgnYLcs5OTLY2nmrDPpXpcTB1sxSFE"
}
const centrifugoServer = process.env.VUE_APP_CENTRIFUGO_PROTOCOL + "sme-dev.vdc2.com.vn"
const centrifugeJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2dWUtc2RrIn0.rqqFBcGquJJL68qrdEIFHbVv9SIjSLCfcnafNGx1T0M"

// Create a new Config
const config = new Object({
    device: device,
    centrifugoServer: centrifugoServer,
    centrifugeJWT: centrifugeJWT
})

// Export config file
export default config