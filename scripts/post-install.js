const fs = require('fs-extra')
try {
    fs.copySync( './config/config.env')
    
} catch (err) {
    console.error(err)
}