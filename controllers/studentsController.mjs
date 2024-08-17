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
import { WeekSchedule } from "../models/WeekSchedule.mjs";
import { ExamSchedule } from "../models/ExamSchedule.mjs";
import { Rol } from "../models/Rol.mjs";
import moment from "moment";
import { notification } from "../config/notification.mjs";

//web
export const webHomePage = asyncHandler(async (req, res) => {
  const data = await Students.find({ class_id: req.body.class_id });
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, data: data });
});
export const showClasses = asyncHandler(async (req, res) => {
  const role = await Rol.findById(req.role_id);
  if (role.name === "موجه") {
    const result = await Classes.find({ admin: req.user_id });
    if (!result) {
      return res.json({
        status: false,
        message: "حدث خطأ ما",
      });
    }
    return res.json({ status: true, data: result });
  } else {
    const result = await Classes.find();
    if (!result) {
      return res.json({
        status: false,
        message: "حدث خطأ ما",
      });
    }
    return res.json({ status: true, data: result });
  }
});
export const showStudentInfo = asyncHandler(async (req, res) => {
  const student = await Students.findById(req.body.id).populate("class_id");
  const violation = await Student_violation.find({ student_id: req.body.id });
  const delay = await Student_absence.find({
    student_id: req.body.id,
    delay_time: { $exists: true },
  });
  const absence = await Student_absence.find({
    student_id: req.body.id,
    delay_time: { $exists: false },
  });
  const test = await Marks.find({
    student_id: req.body.id,
    type: "مذاكرة",
  }).populate(["subject_id"]);
  const oral = await Marks.find({
    student_id: req.body.id,
    type: "شفهي",
  }).populate(["subject_id"]);
  const exam = await Marks.find({
    student_id: req.body.id,
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
  if (!student) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

  return res.json({
    status: true,
    student,
    violation,
    delay,
    absence,
    average_test,
    average_oral,
    average_exam,
    full_average: (average_test + average_oral + average_exam) / 3,
    exam: exam,
    oral: oral,
    test: test,
  });
});
export const searchStudent = asyncHandler(async (req, res) => {
  let data;
  if (req.body.class_id && req.body.name) {
    data = await Students.find({
      full_name: { $regex: req.body.name },
      class_id: req.body.class_id,
    }).populate("class_id");
  } else if (!req.body.class_id) {
    data = await Students.find({
      full_name: { $regex: req.body.name },
    }).populate("class_id");
  } else if (req.body.class_id && !req.body.name) {
    data = await Students.find({
      class_id: req.body.class_id,
    }).populate("class_id");
  } else {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, data });
});
export const addClass = async (req, res) => {
  try {
    if (!req.body.name || !req.body.section) {
      return res.status(400).json({
        status: false,
        message: "حدث خطأ ما",
      });
    }

    const student = new Classes(req.body);
    const result = await student.save();
    return res.json({
      status: true,
      message: "تم اضافة الصف بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteClass = asyncHandler(async (req, res) => {
  const data = await Classes.findByIdAndDelete(req.body.id);

  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
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
export const deleteStudent = asyncHandler(async (req, res) => {
  const data = await Students.findByIdAndDelete(req.body.id);
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
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
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

  if (!delay || !absence) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

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
export const addFile = async (req, res, next) => {
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
    const students = await Students.find({
      class_id: { $in: req.body.classes_id },
    });
    const stu = students.map((i) => i.token).filter((i) => i != null);
    notification(req, res, next, "تم اضافة ملف جديد لصفك", "ملف جديد", stu);
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
  const result = await Classes.find({ admin: req.user_id });
  const files = await Files.find({
    classes_id: { $in: result.map((i) => i.id) },
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
export const showComplaint = asyncHandler(async (req, res) => {
  const files = await Complaint.find()
    .populate("student_id", "full_name")
    .sort({ createdAt: -1 });
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
export const promotion = asyncHandler(async (req, res) => {
  const student = await Students.find({ class_id: req.params.id }).populate(
    "class_id"
  );
  if (!student) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  let studentsPromotion = [];
  await Promise.all(
    student.map(async (i) => {
      const mark = await Marks.find({ student_id: i._id });

      const test = mark.filter((i) => i.type === "مذاكرة");
      const oral = mark.filter((i) => i.type === "شفهي");
      const exam = mark.filter((i) => i.type === "امتحان");

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
      if (average_exam > 40 && average_oral > 40 && average_test > 40) {
        const classes = [
          "السابع",
          "الثامن",
          "التاسع",
          "العاشر",
          "الحادي عشر",
          "البكالوريا",
        ];
        await Promise.all(
          classes.map(async (c, index) => {
            if (i.class_id.name === c) {
              const id = await Classes.find({
                name: classes[index + 1],
                section: i.class_id.section,
              });
              const student = await Students.findByIdAndUpdate(i.id, {
                $set: { class_id: id[0].id },
              });
              studentsPromotion.push(student);
            }
          })
        );
      }
    })
  );
  return res.json({
    status: true,
    studentsPromotion,
  });
});
export const editStudent = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const result = await Students.findByIdAndUpdate(req.body.id, {
    $set: req.body,
  });

  return res.json({ status: true, message: "تم التعديل بنجاح" });
});

//mobile
export const studentLogin = asyncHandler(async (req, res) => {
  let year;
  if (moment().format("MM") <= 8) {
    year = `${moment().subtract(1, "years").format("YYYY")}-${moment().format(
      "YYYY"
    )}`;
  }
  if (moment().format("MM") > 8) {
    year = `${moment().format("YYYY")}-${moment()
      .add(1, "years")
      .format("YYYY")}`;
  }
  if (!req.body?.id) {
    return res.json({ message: "ادخل الرمز" });
  }
  let student = await Students.findById(req.body.id)
    .populate(["class_id"])
    .lean();
  student.year = year;
  if (!student) return res.json({ message: "الرمز غير صحيح" });
  const name1 = student?.full_name;
  const name2 = req.body?.full_name;
  if (name1 !== name2) {
    return res.json({ message: "الاسم غير صحيح" });
  }
  const stu = await Students.findByIdAndUpdate(req.body.id, {
    $set: { token: req.body.token },
  });
  const access_token = jwt.sign({ id: student._id }, process.env.SECRTKEY);
  return res.json({ data: student, token: access_token });
});
export const showStudentProfile = asyncHandler(async (req, res) => {
  let year;
  if (moment().format("MM") <= 8) {
    year = `${moment().subtract(1, "years").format("YYYY")}-${moment().format(
      "YYYY"
    )}`;
  }
  if (moment().format("MM") > 8) {
    year = `${moment().format("YYYY")}-${moment()
      .add(1, "years")
      .format("YYYY")}`;
  }
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const data = await Students.findById(req.student_id)
    .populate(["class_id"])
    .lean();
  if (!data) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  data.year = year;

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

  const sub = await Marks.find({
    student_id: req.student_id,
    subject_id: req.params.id,
  }).populate(["subject_id"]);

  const test = sub.filter((i) => i.type === "مذاكرة");
  const oral = sub.filter((i) => i.type === "شفهي");
  const exam = sub.filter((i) => i.type === "امتحان");

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
  const average_test =
    full_mark_test > 0 ? (mark_test / full_mark_test) * 100 : 0;
  const average_oral =
    full_mark_oral > 0 ? (mark_oral / full_mark_oral) * 100 : 0;
  const average_exam =
    full_mark_exam > 0 ? (mark_exam / full_mark_exam) * 100 : 0;
  let av = 3;
  average_test === 0 ? av-- : null;
  average_oral === 0 ? av-- : null;
  average_exam === 0 ? av-- : null;
  return res.json({
    status: true,
    average:
      ((average_test > 0 ? average_test : 0) +
        (average_oral > 0 ? average_oral : 0) +
        (average_exam > 0 ? average_exam : 0)) /
      av,
    data: sub,
    average_test,
    average_oral,
    average_exam,
    full_mark_test,
    mark_test,
    full_mark_oral,
    mark_oral,
    full_mark_exam,
    mark_exam,
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
  const average_test =
    full_mark_test > 0 ? (mark_test / full_mark_test) * 100 : 0;
  const average_oral =
    full_mark_oral > 0 ? (mark_oral / full_mark_oral) * 100 : 0;
  const average_exam =
    full_mark_exam > 0 ? (mark_exam / full_mark_exam) * 100 : 0;
  let av = 3;
  average_test === 0 ? av-- : null;
  average_oral === 0 ? av-- : null;
  average_exam === 0 ? av-- : null;

  return res.json({
    status: true,
    average_test,
    average_oral,
    average_exam,
    full_average:
      ((average_test > 0 ? average_test : 0) +
        (average_oral > 0 ? average_oral : 0) +
        (average_exam > 0 ? average_exam : 0)) /
      av,
    exam: exam,
    oral: oral,
    test: test,
    full_mark_test,
    mark_test,
    full_mark_oral,
    mark_oral,
    full_mark_exam,
    mark_exam,
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

  const te = test.map((i) => i.subject_id).filter((i) => i !== null);
  const data = [...new Set(te)];
  return res.json({
    status: true,
    data,
  });
});
export const showStudentWeekSchedule = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const classStudent = await Students.findById(req.student_id);

  const result = await WeekSchedule.find({
    class_id: classStudent.class_id,
  }).lean();
  const son = result.filter((i) => i.day === "الاحد");
  const mun = result.filter((i) => i.day === "الاثنين");
  const the = result.filter((i) => i.day === "الثلاثاء");
  const wen = result.filter((i) => i.day === "الاربعاء");
  const tus = result.filter((i) => i.day === "الخميس");
  const arr = [son, mun, the, wen, tus];
  arr.map((d) => {
    d.map((i) => {
      if (i.order === 1) {
        i.from = "08:00";
        i.to = "08:45";
      }
      if (i.order === 2) {
        i.from = "08:45";
        i.to = "09:30";
      }
      if (i.order === 3) {
        i.from = "09:30";
        i.to = "10:15";
        d.push({
          _id: "1",
          name: "استراحة",
          __v: 0,
          from: "10:15",
          to: "10:30",
        });
      }
      if (i.order === 4) {
        i.from = "10:30";
        i.to = "11:15";
      }
      if (i.order === 5) {
        i.from = "11:15";
        i.to = "12:00";
        son.push({
          _id: "2",
          name: "استراحة",
          __v: 0,
          from: "12:15",
          to: "12:30",
        });
      }
      if (i.order === 6) {
        i.from = "12:15";
        i.to = "01:00";
      }
      if (i.order === 6) {
        i.from = "01:00";
        i.to = "01:45";
      }
    });
  });

  return res.json({
    status: true,
    son,
    mun,
    the,
    wen,
    tus,
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
export const showStudentExamSchedule = asyncHandler(async (req, res) => {
  if (!req.student_id) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  const classStudent = await Students.findById(req.student_id).populate(
    "class_id"
  );

  const data = await ExamSchedule.find({
    class: classStudent?.class_id?.name,
  }).lean();
  data.map((i) => {
    const date = moment(i?.date).locale("ar");
    i.date = date.format("ll");
    i.day = date.format("dddd");
  });
  if (!data) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({
    status: true,
    data,
  });
});
export const testNotification = asyncHandler(async (req, res, next) => {
  const tokens = [req.body.token];
  notification(req, res, next, req.body.message, req.body.title, tokens);
  return res.json({ message: "تم ارسال الاشعار" });
});

//web&&mobile
export const showEvents = asyncHandler(async (req, res) => {
  const result = await events.find().populate("admin_added", "name");
  return res.json({ status: true, data: result });
});
