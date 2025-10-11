import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const body = await readBody(event)
  return await prisma.predication.update({
    where: { id },
    data: body,
  })
})
