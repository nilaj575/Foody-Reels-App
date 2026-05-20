let imagekit=null;

async function getImageKit() {
  if (!imagekit) {
    const ImageKit = (await import("imagekit")).default;

    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imagekit;
}

async function uploadFile(file, fileName) {
  const ik = await getImageKit();
  return await ik.upload({
    file,
    fileName,
  
  });
}

module.exports = { uploadFile };
