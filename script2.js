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
  glitcher.glitchClamp(glitcher.redBlueOverlay(glitcher.smear(secondImage.frames[0].data, 66)))
  glitcher.ghostColors(glitcher.rowslice(image.frames[0].data, 66*666))
  glitcher.cloneChannel(image.frames[0].data, secondImage.frames[0].data, Math.random() * 3 | 0)
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
