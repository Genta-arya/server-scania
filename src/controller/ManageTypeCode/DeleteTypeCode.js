import prisma from "../../config/prisma.js";
import { handleError } from "../../utils/errorHandler.js";

export const HandleDeleteType = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    const checkId = await prisma.codeType.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkId) {
      return res.status(400).json({ error: "Id not found" });
    }

    await prisma.codeType.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Code deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export const handleDeleteTypeData = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    const checkId = await prisma.type.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkId) {
      return res.status(400).json({ error: "Id not found" });
    }

    await prisma.codeType.deleteMany({
      where: {
        typeId: parseInt(id),
      },
    });

    await prisma.type.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({
      message: "Code deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};
