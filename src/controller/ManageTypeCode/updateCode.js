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

export const manageAbout = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }
  const { fileUrl, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const checkId = await prisma.about.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!checkId) {
      return res.status(400).json({ error: "Id not found" });
    }
    if (!fileUrl) {
      await prisma.about.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content: content,
          
        },
      });
    } else {
      await prisma.about.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content: content,
          fileUrl: fileUrl,
        },
      });
    }

    return res.status(200).json({
      message: "About updated successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAbout = async (req, res) => {
  try {
    const data = await prisma.about.findMany();
    return res.status(200).json({ data });
  } catch (error) {
    handleError(res, error);
  }
};
