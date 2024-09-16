import prisma from "../../config/prisma.js";

export const getTypeCode = async (req, res) => {
  try {
    const type = await prisma.type.findMany({
        include: {
            codes: true
        },
        orderBy: {
            name: 'asc'
        }
    });
    return res.status(200).json({ data: type });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
