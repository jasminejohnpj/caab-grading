import laws from "../model/law.js";
import businesstype from "../model/businesstype.js";
import Questions from "../model/questions.js";



export const uploadJson = async (req, res) => {
  try {

    const data = req.body; 

    if (Array.isArray(data)) {
      try {
        await Questions.bulkCreate(data);

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


export const addQuestions = async (req, res) => {
  try {
    const data = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Array of questions is required" });
    }

    const inserted = await Questions.insertMany(data);
    return res.status(200).json({
      message: "Questions added successfully",
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    console.error("Error inserting questions:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
