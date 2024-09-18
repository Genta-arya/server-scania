export const handlePostTypeCode = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const checkUniqueName = await prisma.type.findFirst({
      where: {
        name: name,
      },
    });

    if (checkUniqueName) {
      return res.status(400).json({ error: "Type already exists" });
    }

    const codes = [];

    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("codes[") && key.endsWith("].code")) {
        const index = parseInt(key.match(/\d+/)[0]);
        const code = req.body[key];
        const pdfFile = req.files.find(
          (file) => file.fieldname === `codes[${index}].pdf`
        );

        if (code && pdfFile) {
          const pdfUrl = `${BASE_URL}/dokumen/${pdfFile.filename}`;
          codes.push({ code, pdfUrl });
        }
      }
    });

    if (codes.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one code with PDF is required" });
    }

    const checkCodeAlreay = await prisma.codeType.findMany({
      where: {
        code: {
          in: codes.map((code) => code.code),
        },
      },
    });

    if (checkCodeAlreay.length > 0) {
      return res.status(400).json({ error: "Code already exists" });
    }

    await prisma.type.create({
      data: {
        name,
        codes: {
          create: codes.map(({ code, pdfUrl }) => ({
            code,
            pdfUrl,
          })),
        },
      },
    });

    res.status(201).json({ message: "Type created succesfully" });
  } catch (error) {
    handleError(res, error);
  }
};
