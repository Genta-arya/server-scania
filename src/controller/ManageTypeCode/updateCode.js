import prisma from "../../config/prisma.js";
import { handleError } from "../../utils/errorHandler.js";

export const updatedCode = async (req, res) => {
  const { code, pdfUrl } = req.body;
  const { id } = req.params;
  if (!code) {
    return res.status(400).json({ error: "Code  are required" });
  }
  try {
    // if not id then create
    const checkUniqCode = await prisma.codeType.findFirst({
      where: {
        code: code,
        NOT: {
          id: parseInt(id),
        },
      },
    });
    if (checkUniqCode) {
      return res.status(400).json({ error: "Code already exists" });
    }
    if (!pdfUrl) {
      await prisma.codeType.update({
        where: {
          id: parseInt(id),
        },
        data: {
          code: code,
          
        },
      });
    } else {
      await prisma.codeType.update({
        where: {
          id: parseInt(id),
        },
        data: {
          code: code,
          pdfUrl: pdfUrl,
        },
      });
    }
    return res.status(200).json({
      message: "Code updated successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};
