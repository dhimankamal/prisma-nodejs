const { PrismaClient } = require('@prisma/client')
const { updatePostData, updateCategoryData, updateTagsData } = require('./lib')

const prisma = new PrismaClient()
//functions
const main = async () => {
  let updatePostDataRes = await updatePostData()
  //let updateCategoryDataRes = await updateCategoryData()
  // let updateTagsDataRes = await updateTagsData()
  console.log(
    'updatePostDataRes++',
   updatePostDataRes,
    //updateCategoryDataRes,
    // updateTagsDataRes
  )
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
