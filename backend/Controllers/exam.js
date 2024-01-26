const Exam = require("../Models/exam");
const moment = require('moment');
const multer = require('multer');
const User = require('../Models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: 'pracbot2024@gmail.com',
        pass: 'iizi crxq ymch phzs',
    },
});

const sendMail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: 'pracbot2024@gmail.com',
            to,
            subject,
            text,
        });
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const uploadExam = async (req, res) => {
    try {
        const { filename, path } = req.file;
        const { name, branch, sem, subject, startTime, endTime , date} = req.body;

        const st = moment(startTime, 'HH:mm', true).toDate();
        const et = moment(endTime, 'HH:mm', true).toDate();

        const user = await User.findOne({ email: req.user.email });
        const instructorId = user._id;
        const newExam = new Exam({
            name,
            branch,
            sem,
            subject,
            scheduledBy: instructorId,
            startTime: st,
            endTime: et,
            filename,
            path,
            date
        });
        await newExam.save();
        
        const students = await User.find({ sem, branch });
        const emailSubject = 'Exam Notification';

        const emailPromises = students.map(async (student) => {
            let emailText = `Dear ${student.fname}, ${name} of ${subject} has been Scheduled on ${date} at ${startTime} am. Good luck!`;
            await sendMail(student.email, emailSubject, emailText);
        });

        await Promise.all(emailPromises);



        console.log(newExam);
        res.status(201).json({ newExam, success: true, message: 'Exam uploaded successfully!' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
}

const getStudentExams = async (req, res) => {
    try {

        const student = await User.findOne({ email: req.user.email });
        const { sem, branch } = student;

        const exams = await Exam.find({ sem, branch });
        res.status(200).json({ exams, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error, message: 'Internal Server Error' });
    }
}

const getInstructorExam = async (req, res) => {
    try {
        const instructor = await User.findOne({ email: req.user.email });
        const exams = await Exam.find({ scheduledBy: instructor._id });

        res.status(200).json({ exams, success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error, message: 'Internal Server Error' });
    }

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/exams');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


module.exports = { uploadExam, storage, getStudentExams, getInstructorExam };