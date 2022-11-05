const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getPostData = async page => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://themoviesverse.co/wp-json/wp/v2/posts?per_page=100&page=${page}`
    })

    if (res && res.data) {
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
}

const updatePostData = async () => {
  try {
    let updateData = []
    for (let index = 1; index < 10; index++) {
      // const element = array[index];
      const data = await getPostData(index)
      if (data.length) {
        updateData = [...updateData, ...data]
      } else {
        break
      }
    }
    updateData.forEach(
      async ({ id, date, slug, title, content, excerpt, categories, tags, featured_media }) => {
        let obj = {
          postid: String(id),
          date,
          slug,
          content,
          title: title.rendered,
          excerpt,
          categories,
          tags,
          featured_media
        }
        await prisma.data.upsert({
          where: { slug: slug || '' },
          update: obj,
          create: obj
        })
      }
    )
    return `done ${updateData.length}`
  } catch (error) {
    return error
  }
}

const getCategory = async (page) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://themoviesverse.co/wp-json/wp/v2/categories?per_page=100&page=${page}`
    })

    if (res && res.data) {
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
}

const updateCategoryData = async () => {
  try {
    let updateData = []
    for (let index = 1; index < 10; index++) {
      // const element = array[index];
      const data = await getCategory(index)
      if (data.length) {
        updateData = [...updateData, ...data]
      } else {
        break
      }
    }
    updateData.forEach(async ({ id, name, slug }) => {
      let obj = {
        categorieid: +id,
        name,
        slug
      }
      await prisma.categories.upsert({
        where: { categorieid: +id },
        update: obj,
        create: obj
      })
    })

    return `data length ${updateData.length}`
  } catch (error) {
    return error
  }
}
const getTags = async (page) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://themoviesverse.co/wp-json/wp/v2/tags?per_page=100&page=${page}`
    })

    if (res && res.data) {
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
}

const updateTagsData = async () => {
  try {
    let updateData = []
    for (let index = 1; index < 10; index++) {
      // const element = array[index];
      const data = await getTags(index)
      if (data.length) {
        updateData = [...updateData, ...data]
      } else {
        break
      }
    }
    updateData.forEach(async ({ id, name, slug }) => {
      let obj = {
        tagid: +id,
        name,
        slug
      }
      await prisma.tags.upsert({
        where: { tagid: +id },
        update: obj,
        create: obj
      })
    })

    return `data length ${updateData.length}`
  } catch (error) {
    return error
  }
}



module.exports = {
  getPostData,
  updatePostData,
  getCategory,
  updateCategoryData,
  updateTagsData
}
