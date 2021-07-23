/**
 * @param  {string} base64strImage
 */
function decodeBase64Image(base64strImage) {
  // eslint-disable-next-line no-useless-escape
  const stringFormat = /^data:[A-Za-z-+\/]+;base64,.+$/;
  if (!stringFormat.test(base64strImage)) {
    throw new Error('Invalid input string');
  }

  const imageRegex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
  let matches = imageRegex.exec(base64strImage);
  let response = {};

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
}

module.exports = {
  decodeBase64Image
};
