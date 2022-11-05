const { PrismaClient } = require('@prisma/client')
const axios = require('axios')
const prisma = new PrismaClient()

const cloudinary = require('cloudinary').v2
cloudinary.config({
  secure: true
})

const uploadImage = async imagePath => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true
  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options)
    return result.secure_url
  } catch (error) {
    console.error(error)
  }
}

const getUrl = async id => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://themoviesverse.co/wp-json/wp/v2/media/${id}`
    })

    if (res && res.data) {
      return res.data.link
    }
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

const main = async () => {
  let postList = await prisma.data.findMany()
  postList.forEach(async element => {
    if (element.featured_media) {
      let uploadImageUrl = ''
      let Url = await getUrl(element.featured_media)
      if (Url) {
        let uploadImageUrl =  await uploadImage(Url);
        await prisma.data.upsert({
          where: { slug: element.slug || '' },
          update: {
             imageUrl:uploadImageUrl
          },
          create:{
            postid: 'error',
            date : 'error',
            slug: 'error',
            content: 'error',
            title: 'error',
            excerpt: 'error',
            categories: 'error',
            tags:'error'
          }
        })
        console.log('Url', uploadImageUrl)
      }
    }

    
  })
  //console.log("post List",postList)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
