import prisma from "../../config/prisma.js";
import { handleError } from "../../utils/errorHandler.js";

export const createFolder = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    // check uniq name
    const check = await prisma.folder.findUnique({
      where: {
        name,
      },
    });

    if (check) {
      return res.status(400).json({ error: "Folder already exists" });
    }
    await prisma.folder.create({
      data: {
        name,
      },
    });

    return res.status(200).json({
      message: "Folder created successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getDataFolder = async (req, res) => {
  try {
    const data = await prisma.folder.findMany();
    return res.status(200).json({ data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getSingleFolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }
    const data = await prisma.folder.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        files: true,
      },
    });
    return res.status(200).json({ data });
  } catch (error) {
    handleError(res, error);
  }
};

export const uploadFile = async (req, res) => {
  const { id } = req.params;
  const { urls } = req.body; // Mengambil array 'urls' dari body request

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res
      .status(400)
      .json({ error: "Urls are required and must be an array" });
  }

  try {
    const filesData = urls.map((url) => ({
      fileUrl: url,
      folderId: parseInt(id),
    }));

    await prisma.file.createMany({
      data: filesData,
    });

    return res.status(200).json({ message: "Files created successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export const changeNameFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    // check name is already
    const check = await prisma.folder.findUnique({
      where: {
        name,
        NOT: {
          id: parseInt(id),
        },
      },
    });
    if (check) {
      return res.status(400).json({ error: "Folder already exists" });
    }
    await prisma.folder.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return res
      .status(200)
      .json({ message: "Folder name updated successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }
  try {
     // delete relasi
    await prisma.file.deleteMany({
      where: {
        folderId: parseInt(id),
      },
    });
    await prisma.folder.delete({
      where: {
        id: parseInt(id),
      },
    });
   

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
