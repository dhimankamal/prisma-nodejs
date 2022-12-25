const { PrismaClient } = require('@prisma/client')
const axios = require('axios')
const prisma = new PrismaClient()

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'dsbt42aq4',
  api_key: '627996989796998',
  api_secret: 'zTQzZMry9JOnN5Nu_cvF28V4OBU',
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
      url: `https://themoviesverse.net/wp-json/wp/v2/media/${id}`
    })
    // console.log('Id++', id)
    // console.log("url++", res.data.link )
    if (res && res.data) {
      return res.data.link
    }
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

const main = async () => {
  let postList = await prisma.data.findMany(
    {
      take: 20,
      orderBy: {
        date: "desc",
      },
      // where:{
      //   imageUrl: null
      // },
    }
  )
  
  postList.forEach(async element => {
    if (element.featured_media) {
      let uploadImageUrl = ''
      let Url = await getUrl(element.featured_media)
      console.log('url', Url)
      if (Url) {
        uploadImageUrl = await uploadImage(Url)
        let prismares = await prisma.data.upsert({
          where: { slug: element.slug || '' },
          update: {
            imageUrl: uploadImageUrl
          },
          create: {
            postid: 'error',
            date: 'error',
            slug: 'error',
            content: 'error',
            title: 'error',
            excerpt: 'error',
            categories: 'error',
            tags: 'error'
          }
        })
        console.log('prismares++++', prismares)
        console.log('peisma response++++', postList.length)
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
