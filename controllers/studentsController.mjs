import { Classes } from "../models/Classes.mjs";
import { Students, validateStudents } from "../models/Students.mjs";
import asyncHandler from "express-async-handler";
import {
  Student_absence,
  Student_absenceValidate,
} from "../models/Student_absence.mjs";
import {
  Student_violation,
  Student_violationValidate,
} from "../models/Student_violation.mjs";
import { events } from "../models/events.mjs";
import jwt from "jsonwebtoken";
import { Complaint, ComplaintValidate } from "../models/Complaint.mjs";
import { Subjects } from "../models/Subjects.mjs";
import { marksValidate, Marks } from "../models/Marks.mjs";
import { Files, FilesValidate } from "../models/Files.mjs";
import { uploadFile } from "../config/uploadFiles.mjs";
import { deleteFile2 } from "../config/deleteFiles.mjs";

//web
export const showClasses = asyncHandler(async (req, res) => {
  const result = await Classes.find();
  return res.json({ status: true, data: result });
});
export const addStudent = async (req, res) => {
  try {
    const { error } = validateStudents(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const student = new Students(req.body);

    const result = await student.save();
    return res.json({
      status: true,
      message: "تم اضافة الطالب بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const addStudentAbsence = async (req, res) => {
  try {
    const { error } = Student_absenceValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const absence = new Student_absence(req.body);

    const result = await absence.save();
    return res.json({
      status: true,
      message: "تم اضافة التأخير بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const addStudentViolation = async (req, res) => {
  try {
    const { error } = Student_violationValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const absence = new Student_violation(req.body);

    const result = await absence.save();
    return res.json({
      status: true,
      message: "تم اضافة المخالفة بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const showStudentsViolation = asyncHandler(async (req, res) => {
  const data = await Student_violation.find().populate(
    "student_id",
    "full_name"
  );
  return res.json({
    status: true,
    data: data,
  });
});
export const deleteStudentViolation = asyncHandler(async (req, res) => {
  const data = await Student_violation.findByIdAndDelete(req.body.id);
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
});
export const showStudentsAbsence = asyncHandler(async (req, res) => {
  if (!req.body.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const delay = await Student_absence.find({
    student_id: req.body.student_id,
    delay_time: { $exists: true },
  });
  const absence = await Student_absence.find({
    student_id: req.body.student_id,
    delay_time: { $exists: false },
  });

  return res.json({
    status: true,
    delay: delay,
    absence: absence,
  });
});
export const deleteStudentsAbsence = asyncHandler(async (req, res) => {
  const data = await Student_absence.findByIdAndDelete(req.body.id);
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
});
export const showStudentsAndSubjectForClass = asyncHandler(async (req, res) => {
  if (!req.body.class_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const students = await Students.find({
    class_id: req.body.class_id,
  });
  const subject = await Subjects.find({
    class_id: req.body.class_id,
  });
  return res.json({
    status: true,
    students: students,
    subject: subject,
  });
});
export const addStudentsMarks = async (req, res) => {
  try {
    const { error } = marksValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const type = req.body.type;
    const subject_id = req.body.subject_id;
    const full_mark = req.body.full_mark;
    const date = req.body.date;

    req.body.students?.map(async (student) => {
      if (!student.id || !student.mark) {
        return res.status(450).json({
          status: false,
          message: "حدث خطأ ما",
        });
      }
      const mark = await new Marks({
        type,
        date,
        subject_id,
        full_mark,
        student_id: student.id,
        mark: student.mark,
      }).save();
    });

    return res.json({
      status: true,
      message: "تم اضافة العلامات بنجاح",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const addFile = async (req, res) => {
  try {
    const { error } = FilesValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    if (req.files?.length > 0) {
      const { id } = await uploadFile(req.files[0]);

      if (id) {
        req.body.url = `https://drive.usercontent.google.com/download?id=${id}&export=download`;
      }
    }
    const file = await new Files(req.body).save();

    return res.json({
      status: true,
      message: "تم اضافة الملف بنجاح",
      file,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteFile = asyncHandler(async (req, res) => {
  const data = await Files.findByIdAndDelete(req.body?.id);
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  deleteFile2(data.url?.slice(49, 82));

  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
});
export const showFiles = asyncHandler(async (req, res) => {
  const files = await Files.find({
    class_id: req.body.class_id,
  }).populate([
    { path: "subject_id", select: ["name", "-_id"] },
    { path: "classes_id", select: ["name", "section", "-_id"] },
  ]);
  if (!files) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({
    status: true,
    data: files,
  });
});

//mobile
export const studentLogin = asyncHandler(async (req, res) => {
  if (!req.body?.id) {
    return res.json({ message: "ادخل الرمز" });
  }
  let student = await Students.findById(req.body.id).populate(["class_id"]);
  if (!student) return res.json({ message: "الرمز غير صحيح" });
  const name1 = student?.full_name;
  const name2 = req.body?.full_name;
  if (name1 !== name2) {
    return res.json({ message: "الاسم غير صحيح" });
  }
  const access_token = jwt.sign({ id: student.id }, process.env.SECRTKEY);
  return res.json({ data: student, token: access_token });
});
export const showStudentProfile = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const data = await Students.findById(req.student_id).populate(["class_id"]);
  return res.json({
    status: true,
    data: data,
  });
});
export const showStudentViolation = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const data = await Student_violation.find({
    student_id: req.student_id,
  });
  return res.json({
    status: true,
    data: data,
  });
});
export const showStudentAbsence = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const delay = await Student_absence.find({
    student_id: req.student_id,
    delay_time: { $exists: true },
  });
  const absence = await Student_absence.find({
    student_id: req.student_id,
    delay_time: { $exists: false },
  });

  return res.json({
    status: true,
    delay: delay,
    absence: absence,
  });
});
export const addComplaint = async (req, res) => {
  try {
    const { error } = ComplaintValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    req.body.student_id = req.student_id;
    const complaint = new Complaint(req.body);

    const result = await complaint.save();
    return res.json({
      status: true,
      message: "تم اضافة الشكوى بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const registerEvent = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const event = await events.findById(req.body.id);
  const result = await events.findByIdAndUpdate(req.body.id, {
    $set: {
      number_of_registrants: event.number_of_registrants
        ? event.number_of_registrants + 1
        : 1,
    },
  });
  const event2 = {
    ...result._doc,
    number_of_registrants: event.number_of_registrants
      ? event.number_of_registrants + 1
      : 1,
  };
  return res.json({ status: true, data: event2 });
});
export const unRegisterEvent = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const event = await events.findById(req.body.id);
  const result = await events.findByIdAndUpdate(req.body.id, {
    $set: {
      number_of_registrants: event.number_of_registrants
        ? event.number_of_registrants - 1
        : 0,
    },
  });
  const event2 = {
    ...result._doc,
    number_of_registrants: event.number_of_registrants
      ? event.number_of_registrants - 1
      : 0,
  };
  return res.json({ status: true, data: event2 });
});
export const showStudentMarks2 = asyncHandler(async (req, res) => {
  if (!req.student_id || !req.params.id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

  const test = await Marks.find({
    student_id: req.student_id,
    subject_id: req.params.id,
  }).populate(["subject_id"]);

  let full_mark = 0;
  let mark = 0;
  test.map((i) => {
    full_mark += i.full_mark;
    mark += i.mark;
  });

  const average = (mark / full_mark) * 100;

  return res.json({
    status: true,
    average,
    data: test,
  });
});
export const showStudentMarks = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

  const test = await Marks.find({
    student_id: req.student_id,
    type: "مذاكرة",
  }).populate(["subject_id"]);
  const oral = await Marks.find({
    student_id: req.student_id,
    type: "شفهي",
  }).populate(["subject_id"]);
  const exam = await Marks.find({
    student_id: req.student_id,
    type: "امتحان",
  }).populate(["subject_id"]);

  let full_mark_test = 0;
  let mark_test = 0;
  test.map((i) => {
    full_mark_test += i.full_mark;
    mark_test += i.mark;
  });
  let full_mark_oral = 0;
  let mark_oral = 0;
  oral.map((i) => {
    full_mark_oral += i.full_mark;
    mark_oral += i.mark;
  });
  let full_mark_exam = 0;
  let mark_exam = 0;
  exam.map((i) => {
    full_mark_exam += i.full_mark;
    mark_exam += i.mark;
  });
  const average_test = (mark_test / full_mark_test) * 100;
  const average_oral = (mark_oral / full_mark_oral) * 100;
  const average_exam = (mark_exam / full_mark_exam) * 100;
  return res.json({
    status: true,
    average_test,
    average_oral,
    average_exam,
    full_average: (average_test + average_oral + average_exam) / 3,
    exam: exam,
    oral: oral,
    test: test,
  });
});
export const homePage = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

  const exam = await Marks.find({
    student_id: req.student_id,
  });
  const absence = await Student_absence.find({
    student_id: req.student_id,
    delay_time: { $exists: false },
  });

  let full_mark_exam = 0;
  let mark_exam = 0;
  exam.map((i) => {
    full_mark_exam += i.full_mark;
    mark_exam += i.mark;
  });

  return res.json({
    status: true,
    absence: absence.length,
    full_average: mark_exam / full_mark_exam,
  });
});
export const showSubjectForStudent = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const test = await Marks.find({
    student_id: req.student_id,
  }).populate("subject_id", "name");

  return res.json({
    status: true,
    data: test,
  });
});
export const showStudentFiles = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const classStudent = await Students.findById(req.student_id);

  const data = await Files.find({ classes_id: classStudent.class_id }).populate(
    "subject_id",
    ["-_id", "name"]
  );

  return res.json({
    status: true,
    data,
  });
});

//web&&mobile
export const showEvents = asyncHandler(async (req, res) => {
  const result = await events.find().populate("admin_added", "name");
  return res.json({ status: true, data: result });
});
