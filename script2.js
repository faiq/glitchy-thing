const Promise = require('bluebird'),
      readFile = Promise.promisify(require("fs").readFile),
      writeFile = Promise.promisify(require("fs").writeFile),
      readimage = Promise.promisify(require('readimage')),
      glitcher = require('glitcher'), 
      writepng = Promise.promisify(require('writepng'))

function readOtherFile (image) {
  return readFile(process.argv[3]).then(readimage).then(function (secondImage) {
    return glitchify(image, secondImage)
  })
}

function glitchify(image, secondImage) {
  var buf1 = image.frames[0].data
  glitcher.glitchClamp(glitcher.redBlueOverlay(glitcher.smear(secondImage.frames[0].data, 66)), 666)
  glitcher.cloneChannel(glitcher.rowslice(buf1, 6666*666), secondImage.frames[0].data, 2)
  return writepng(secondImage)
}

readFile(process.argv[2]).then(function (contents) {
    return readimage(contents)
  })
  .then(readOtherFile)
  .then(function (glitchedgif) {
    return writeFile(process.argv[4], glitchedgif)
  })
  .catch(function (err) {
    console.log(err) 
  })
