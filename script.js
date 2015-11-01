const Promise = require('bluebird'),
      readFile = Promise.promisify(require("fs").readFile),
      writeFile = Promise.promisify(require("fs").writeFile),
      readimage = Promise.promisify(require('readimage')),
      glitcher = require('glitcher'), 
      writepng = Promise.promisify(require('writepng'))

readFile(process.argv[2]).then(function (contents) {
    return readimage(contents)
  })
  .then(function (image) {
    image.frames.forEach(function (frame) {
      glitcher.glitchClamp(glitcher.redBlueOverlay(glitcher.rowslice(glitcher.pixelshift(glitcher.smear(frame.data, 66.6), 666), 666*666)))
    })
    return writepng(image)
  })
  .then(function (glitchedgif) {
    return writeFile('output.png', glitchedgif)
  })
  .catch(function (err) {
    console.log(err) 
  })
