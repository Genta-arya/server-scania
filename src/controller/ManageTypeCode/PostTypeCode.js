
import prisma from "../../config/prisma.js";
import { handleError } from "../../utils/errorHandler.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const handlePostTypeCode = async (req, res) => {
  try {
    const { name, codes } = req.body;
    console.log(req.body);

    // Cek jika nama 'type' tidak disediakan
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }


    // Cek jika nama 'type' sudah ada
    const checkUniqueName = await prisma.type.findFirst({
      where: {
        name: name,
      },
    });

    if (checkUniqueName) {
      return res.status(400).json({ error: "Type already exists" });
    }

    // Pastikan 'codes' disediakan dalam request
    if (!codes || codes.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one code with PDF link is required" });
    }

    // Validasi dan persiapkan data untuk disimpan
    const codeData = codes.map((codeObj) => {
      const { code, pdfUrl } = codeObj;

      // Pastikan 'code' dan 'pdfUrl' disediakan untuk setiap item
      if (!code || !pdfUrl) {
        throw new Error("Each code must have a valid code and pdfUrl");
      }

      return { code, pdfUrl };
    });

    // Cek apakah ada code yang sudah ada di database
    const checkCodeAlready = await prisma.codeType.findMany({
      where: {
        code: {
          in: codeData.map((item) => item.code),
        },
      },
    });

    if (checkCodeAlready.length > 0) {
      return res.status(400).json({ error: "One or more codes already exist" });
    }

    // Simpan type baru dan kode-kodenya
    await prisma.type.create({
      data: {
        name,
        codes: {
          create: codeData,
        },
      },
    });

    // Response sukses
    res.status(201).json({ message: "Type created successfully" });
  } catch (error) {
    // Gunakan handleError untuk menangani error dan memberikan respon error
    handleError(res, error);
  }
};

export const addNewCode = async (req, res) => {
  const { typeId, code, pdfUrl } = req.body;

  // Validasi input
  if (!typeId || !code || !pdfUrl) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingCode = await prisma.codeType.findFirst({
      where: { code },
    });

    if (existingCode) {
      return res.status(400).json({ error: "Code already exists." });
    }

    const newCode = await prisma.codeType.create({
      data: {
        typeId,
        code,
        pdfUrl,
      },
    });

    res.status(201).json(newCode);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleRenameType = async (req, res) => {
  const { typeId: id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "Name and id are required" });
  }

  try {
    const checkAlreadyName = await prisma.type.findFirst({
      where: {
        name: name,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (checkAlreadyName) {
      return res.status(400).json({ error: "Type already exists" });
    }

    // Jika tidak ada konflik nama, lakukan pembaruan nama di database
    await prisma.type.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });

    return res.status(200).json({
      message: "Type name updated successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const postWiringFile = async (req, res) => {
  const { name, urls } = req.body; // 'name' di sini diasumsikan array
  try {
    // Cek apakah ada file yang namanya sudah ada di database
    const existingFiles = await prisma.wiringFile.findMany({
      where: {
        name: {
          in: name, // Menggunakan operator 'in' untuk memeriksa multiple nama file
        },
      },
    });

    if (existingFiles.length > 0) {
      return res
        .status(400)
        .json({ error: "Some files already exist", existingFiles });
    }

   
    const newFiles = await prisma.wiringFile.createMany({
      data: name.map((fileName, index) => ({
        name: fileName,
        fileUrl: urls[index], 
      })),
    });

    return res.status(200).json({
      message: "Files created successfully",
      newFiles,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getDataWiring = async (req, res) => {
  try {
    const files = await prisma.wiringFile.findMany();
    return res.status(200).json({ data: files });
  } catch (error) {
    handleError(res, error);
  }
}

export const deleteWiringFile = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.wiringFile.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
}
