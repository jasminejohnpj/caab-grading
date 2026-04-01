import laws from "../model/law.js";
import businesstype from "../model/businesstype.js";
import Questions from "../model/questions.js";
import department from "../model/department.js";



export const uploadbusinesstype = async (req, res) => {
  try {

    const data = req.body; 

    if (Array.isArray(data)) {
      try {
        await businesstype.bulkCreate(data);

        return res
          .status(200)
          .send({ message: "Data added to the database successfully" });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: "An error occurred while adding to the database" });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Invalid data format. Please send an array of objects." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};


export const uploadJson = async (req, res) => {
  try {
    const { table, data } = req.body;

    const modelMap = {
      departments: department,
    //  businesstypes: businesstype,
      laws: laws,
      questions: Questions,
    };

    if (!table || !modelMap[table]) {
      return res.status(400).json({
        message: "Invalid table name",
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Data must be a non-empty array",
      });
    }

    const Model = modelMap[table];

    const flatData = Array.isArray(data[0]) ? data.flat() : data;

    const result = await Model.bulkCreate(flatData, {
      validate: true,
    });

    return res.status(200).json({
      message: `${table} data inserted successfully`,
      count: result.length,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
