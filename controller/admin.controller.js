import department from "../model/department.js";
import businesstype from "../model/businesstype.js";
import laws from "../model/law.js";
import Questions from "../model/questions.js";
import { ValidationError, UniqueConstraintError } from "sequelize";





export const Department = async (req, res, next) => {
  try {
    const { department_name, department_type, appropriate_govt } = req.body;

    if (
      !department_name || department_name.trim() === "" ||
      !department_type || department_type.trim() === "" ||
      !appropriate_govt || appropriate_govt.trim() === ""
    ) {
      return res.status(400).json({ message: "Missing field values" });
    }

    // 🔍 Check if department already exists by name
    const existingDepartment = await department.findOne({
      where: { department_name },
    });

    if (existingDepartment) {
      return res.status(409).json({ message: "Department name already exists" });
    }

    const newDepartment = await department.create({
      department_name,
      department_type,
      appropriate_govt,
    });

    return res.status(201).json({
      message: "Department added successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    next(error.message);
  }
};

export const Departments = async (req, res, next) => {
  try {
    const departmentlist = await department.findAll({
      attributes: ['department_name'],
    });
    const departmentNames = departmentlist.map(dept => dept.department_name);

    if (!departmentlist) {
      return res.status(204).json({ message: "departments not found" });
    }
    return res.status(200).json(departmentNames);
  } catch (error) {
    next(error);
  }
}

export const updateDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { department_type, appropriate_govt } = req.body;
    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(204).json({ message: "Department not found" });
    }
    const new_data = await department.update(
      {
        department_type,
        appropriate_govt
      },
      {
        where: { id }
      });
    return res.status(201).json({ message: " department updated successfully" });
  }
  catch (error) {
    next(error);
  }
}

export const removeDept = async (req, res, next) => {
  try {
    const id = req.params.id;

    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    const department_details = await department.findOne({ where: { id } });
    await department_details.destroy();
    return res.status(200).json({ message: "department deleted successfully" });
  } catch (error) {
    next(error)
  }
}

export const deptById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "id is required" });
    }
    const dept = await department.findOne({ where: { id } });
    return res.status(200).json(dept)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "internal server error" })
  }
}

export const listDept = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await department.count();

    const totalPages = Math.ceil(totalCount / pageSize);

    if (page > totalPages) {
      return res.status(200).json({
        message: "No departments found for this page",
        departments: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;

    const allDepartments = await department.findAll({
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    });

    return res.status(200).json({
      message: "Department list",
      departments: allDepartments,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching department list:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const getDepartmentsByBusinessType = async (req, res, next) => {
  try {
    const businessType = req.params.business_type;

    if (!businessType) {
      return res.status(400).json({ message: "Business type is required" });
    }

    const departments = await businesstype.findAll({
      where: { business_type: businessType },
      attributes: ["department_name"],
    });

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found under this business type" });
    }

    // Extract names into an array
    const departmentNames = departments.map((dept) => dept.department_name);

    return res.status(200).json({ departments: departmentNames });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





export const Businesstype = async (req, res, next) => {
  try {
    const { business_type, department_name } = req.body;

    const newdata = await businesstype.create({
      business_type,
      department_name,
    });
    return res
      .status(200)
      .json({ message: "Business type created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const businessTypes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await businesstype.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No businessType found for this page",
        businessType: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;
    const allBusinessType = await businesstype.findAll({
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    });
    return res.status(200).json({
      message: "List of businesstype",
      businessType: allBusinessType,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const updateBusinessType = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { department_name } = req.body;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }

    if (
      !department_name ||
      department_name.trim === ""
    ) {
      return res
        .status(400)
        .json({ message: " Department Name is Required" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if (!data) {
      return res.status(204).json({ message: "Business Type not existing" });
    }
    await businesstype.update(
      {
        department_name,
      },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ message: " updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const removeBusinesstype = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "BusinessType not existing" });
    }
    await data.destroy();
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const businesstypeByid = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "id required" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if (!data) {
      return res.status(403).json({ message: "id not found" });
    }
    return res.status(200).json({
      id: data.id,
      business_type: data.business_type,
      department_name: data.department_name
    })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error", error });

  }
}





export const newLaw = async (req, res, next) => {
  try {
    const { department_name, law, act_rule, section, penalty_amount, due_date, alert_date, gravity } = req.body;
    const newlaw = await laws.create({
      department_name,
      law,
      act_rule,
      section,
      penalty_amount,
      due_date,
      alert_date,
      gravity
    });
    return res.status(200).json({ message: "law created successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
}

export const listLaws = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await laws.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No laws found for this page",
        law: [],
        totalPages,
        totalCount,
      });
    }
    const offset = (page - 1) * pageSize;

    const allLaws = await laws.findAll({
      order: [["id", "DESC"]],
      offset: offset,
    });
    return res.status(200).json({
      message: "laws list ",
      law: allLaws,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export const updateLaw = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newdata = req.body;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    if (!newdata) {
      return res.status(400).json({ message: "data required" });
    }
    const existinglaw = await laws.findOne({ where: { id } });
    if (!existinglaw) {
      return res.status(204).json({ message: "laws not found" });
    }
    await existinglaw.update(newdata);
    return res.status(200).json({ message: "law updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error })
  }
}

export const deleteLaw = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const existinglaw = await laws.findOne({ where: { id } });
    if (!existinglaw) {
      return res.status(204).json({ message: "law is not found" });
    }
    await existinglaw.destroy();
    return res.status(200).json({ message: "law deleted successfully" });
  } catch (error) {
    next(error);
  }
}




export const NewQuestions = async (req, res, next) => {
  try {
    const { section, questionsList } = req.body;
    const newQuestions = await Questions.bulkCreate(
      questionsList.map((q) => ({
        section,
        questions: q.questions,
        gravity: q.gravity,
      }))
    );

    return res.status(200).json({ message: "Questions added successfully" });
  } catch (error) {
    next(error)
  }
}

export const questions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await Questions.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No businessType found for this page",
        questions: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;
    const allQuestions = await Questions.findAll({
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    });
    return res.status(200).json({
      message: "Questions list",
      questions: allQuestions,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const deleteQuestions = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const existingQuestions = await Questions.findOne({ where: { id } });
    if (!existingQuestions) {
      return res.status(204).json({ message: "question is not found" });
    }
    await existingQuestions.destroy();
    return res.status(200).json({ message: "question deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const evaluation = async (req, res, next) => {
  try {
    const { branch_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Page and page size must be positive integers" });
    }

    if (!branch_id) {
      return res.status(400).json({ message: 'Invalid or undefined "branch_id" parameter' });
    }

    const businessType = await branchAdmin.findAll({
      where: { branch_id },
      attributes: ['business_type']
    });

    if (!businessType || businessType.length === 0) {
      return res.status(404).json({ message: 'No business type found for the given branch_id' });
    }

    const { business_type } = businessType[0].dataValues;

    const departments = await businesstype.findAll({
      where: { business_type },
      attributes: ['department_name']
    });

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found for the given business type' });
    }

    const departmentNames = departments.map(dept => dept.department_name);

    const sections = await laws.findAll({
      where: {
        department_name: {
          [Op.in]: departmentNames,
        }
      },
      attributes: ['section']
    });

    if (!sections || sections.length === 0) {
      return res.status(404).json({ message: 'No related laws found for the given departments' });
    }

    const section = sections.map(law => law.section);

    const offset = (page - 1) * pageSize;

    const allQuestions = await Questions.findAll({
      where: { section },
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    });

    const totalCount = await Questions.count({ where: { section } });
    const totalPages = Math.ceil(totalCount / pageSize);

    if (page > totalPages) {
      return res.status(200).json({
        message: "No questions found for this page",
        questions: [],
        totalPages,
        totalCount,
      });
    }

    return res.status(200).json({
      message: "List of questions",
      questions: allQuestions,
      totalPages,
      totalCount,
    });

  } catch (error) {
    next(error);
  }
}

////////// caab admin /////////////



export const listSections = async (req, res, next) => {
  try {
    const list = await laws.findAll({ attributes: ['section'] });

    if (!list) {
      return res.status(204).json({ message: "No sections found." });
    }

    return res.status(200).json(list);
  } catch (error) {
    next(error)
  }
}

export const companies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await User.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No companies found for this page",
        companies: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;

    const companyList = await User.findAll({
      order: [["caab_id", "DESC"]],
      offset: offset,
      limit: pageSize,
    });

    if (!companyList || companyList.length === 0) {
      return res.status(204).json({ message: "Company list is empty" });
    }

    return res.status(200).json({
      message: "List of companies",
      companies: companyList,
      totalCount,
      totalPages,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const grading = async(req , res, next) =>{
  try {
    const { branch_id } = req.body;

        if (!branch_id) {
      return res.status(400).json({ message: "Branch ID not found" });
    }

    const branchResponses = await questionResponse.findAll({ where: { branch_id } });

    if (!branchResponses || branchResponses.length === 0) {
      return res.status(204).json({ message: "No responses found" });
    }

    const validResponses = branchResponses.filter(response => {
      const res = response.response?.trim().toLowerCase();
      return res === "yes" || res === "no";
    });

    let allGravityCounts = { high: 0, medium: 0, low: 0 };
    let yesGravityCounts = { high: 0, medium: 0, low: 0 };

    validResponses.forEach(response => {
      let normalizedResponse = response.response?.trim().toLowerCase();
      let normalizedGravity = response.gravity?.trim().toLowerCase();

      // Count gravity levels for all "yes" and "no" responses
      if (normalizedGravity === "high") allGravityCounts.high++;
      else if (normalizedGravity === "medium") allGravityCounts.medium++;
      else if (normalizedGravity === "low") allGravityCounts.low++;

      // Count gravity levels for "yes" responses only
      if (normalizedResponse === "yes") {
        if (normalizedGravity === "high") yesGravityCounts.high++;
        else if (normalizedGravity === "medium") yesGravityCounts.medium++;
        else if (normalizedGravity === "low") yesGravityCounts.low++;
      }
    });
    // Calculate weighted scores
    const validHigh = allGravityCounts.high * 10;
    const validMedium = allGravityCounts.medium * 5;
    const validLow = allGravityCounts.low * 3;
    const validTotal = validHigh + validMedium + validLow;

    const yesHigh = yesGravityCounts.high * 10;
    const yesMedium = yesGravityCounts.medium * 5;
    const yesLow = yesGravityCounts.low * 3;
    const yesTotal = yesHigh + yesMedium + yesLow;

    // Calculate percentage of "yes" responses
    // const gravityPercentage = validTotal > 0 ? (yesTotal / validTotal) * 100 : 0;

    const gravityPercentage = validTotal > 0 ? Math.floor((yesTotal / validTotal) * 100) : 0;


  const totalcount  = branchResponses.filter(response => {
    const res = response.response?.trim().toLowerCase();
    return res === "yes" || res === "no";
    }).length;
  const yesCount = branchResponses.filter(response => {
    const res = response.response?.trim().toLowerCase();
    return res === "yes"; // Correct comparison
    }).length;

    const completedPercentage = yesCount/totalcount * 100;
    // Generate report for "no" responses
    const Report = validResponses
      .filter(response => response.response?.trim().toLowerCase() === "no")
      .map(response => ({
        section: response.section,
        questions: response.questions
      }));

    return res.status(200).json({
      gravityPercentage,
      Report,
      completedPercentage,
      
    });

  } catch(error){
    next(error.message);
  }
}

export const gradingDetails = async(req, res, next)=>{
   try{
    const {branch_id } = req.params;
    if (!branch_id) {
      return res.status(400).json({ message: "Branch ID not found" });
    }

    const branchResponses = await questionResponse.findAll({ where: { branch_id } });

    if (!branchResponses || branchResponses.length === 0) {
      return res.status(404).json({ message: "No responses found" });
    }

    const validResponses = branchResponses.filter(response => {
      const res = response.response?.trim().toLowerCase();
      return res === "yes" || res === "no";
    });

    let allGravityCounts = { high: 0, medium: 0, low: 0 };
    let yesGravityCounts = { high: 0, medium: 0, low: 0 };

    validResponses.forEach(response => {
      let normalizedResponse = response.response?.trim().toLowerCase();
      let normalizedGravity = response.gravity?.trim().toLowerCase();

      if (normalizedGravity === "high") allGravityCounts.high++;
      else if (normalizedGravity === "medium") allGravityCounts.medium++;
      else if (normalizedGravity === "low") allGravityCounts.low++;

      if (normalizedResponse === "yes") {
        if (normalizedGravity === "high") yesGravityCounts.high++;
        else if (normalizedGravity === "medium") yesGravityCounts.medium++;
        else if (normalizedGravity === "low") yesGravityCounts.low++;
      }
    });
    // Calculate weighted scores
    const validHigh = allGravityCounts.high * 10;
    const validMedium = allGravityCounts.medium * 5;
    const validLow = allGravityCounts.low * 3;
    const validTotal = validHigh + validMedium + validLow;

    const yesHigh = yesGravityCounts.high * 10;
    const yesMedium = yesGravityCounts.medium * 5;
    const yesLow = yesGravityCounts.low * 3;
    const yesTotal = yesHigh + yesMedium + yesLow;

    // Calculate percentage of "yes" responses
    const gravityPercentage = validTotal > 0 ? ((yesTotal / validTotal) * 100).toFixed(2) : "0.00";
    const NegativeCount = branchResponses.filter(response => {
      const res = response.response?.trim().toLowerCase();
      return res === "no"; 
    }).length;

    return res.status(200).json({ gravityPercentage, NegativeCount });

  } catch(error){
    next(error.message)
  }
}

export const Role = async(req, res,next)=>{
  try {
    const { role_name, access, allowed_routes } = req.body;
    const roledata = await roles.create({
      role_name,
      access,
      allowed_routes,
    });
    return res.status(200).json({ message: "Role created successfully", roledata });
  } catch(error){
    next(error.message)
  }
}

export const listRoles = async(req, res, next)=>{
   try {
    const data = await roles.findAll();
    return res.status(200).json({ message: "List of roles", data });
  } catch(error){
    next(error.message);
  }
}

export const getRoleById= async(req, res, next)=>{
   try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(204).json({ message: "role not existing" });
    }
    return res.status(200).json({ message: "role listed:", role });
  } catch(error){
    next(error.message)
  }
}

export const updateRole = async(req, res, next) =>{
   try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id required" });
    }
    const { role_name, access, allowedRoutes } = req.body;
    if (
      !role_name ||
      !access ||
      !allowedRoutes ||
      role_name.trim() === "" ||
      access.length === 0 ||
      allowedRoutes.length === 0
    ) {
      return res
        .status(401)
        .json({ message: "role name, access, allowedRoutes are required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(204).json({ message: "role does not exist" });
    }
    await roles.update({ role_name, access, allowedRoutes }, { where: { id } });
    return res.status(200).json({ message: "role updated successfully" });
  } catch(error){
    next(error)
  }
}

export const deleteRole= async(req, res, next)=>{
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id is required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(204).json({ message: "Role does not exists" });
    }
    await role.destroy();
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch(error){
    next(error.message)
  }
}



