const Admin = require('../models/Admin');
const About = require('../models/About');
const Hero = require('../models/Hero');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Contact = require('../models/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth
exports.getLogin = (req, res) => {
    res.render('admin/login');
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (admin && await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('admin_token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('admin_token');
    res.redirect('/admin/login');
};

const { bucket } = require('../config/firebase');
const path = require('path');

// Helper to upload file to Firebase
const uploadToFirebase = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        
        const newFileName = `${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(newFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.error('Firebase upload error:', error);
            reject(error);
        });

        blobStream.on('finish', async () => {
            // Make the file public
            await fileUpload.makePublic();
            // Get public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
};

exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', { path: '/dashboard' });
};

// Hero
exports.getEditHero = async (req, res) => {
    let hero = await Hero.findOne();
    if (!hero) {
        hero = await Hero.create({});
    }
    res.render('admin/edit-hero', { hero, path: '/hero' });
};

exports.postEditHero = async (req, res) => {
    const { greeting, title, subtitle, primaryCtaText, secondaryCtaText } = req.body;
    let hero = await Hero.findOne();
    
    // Check if file is uploaded
    let heroImage = req.body.heroImage;
    if (req.file) {
        try {
            heroImage = await uploadToFirebase(req.file);
        } catch (error) {
            console.error("Upload failed", error);
        }
    }

    if (hero) {
        hero.greeting = greeting;
        hero.title = title;
        hero.subtitle = subtitle;
        hero.primaryCtaText = primaryCtaText;
        hero.secondaryCtaText = secondaryCtaText;
        if (heroImage) hero.heroImage = heroImage;
        await hero.save();
    } else {
        await Hero.create({ greeting, title, subtitle, primaryCtaText, secondaryCtaText, heroImage });
    }
    res.redirect('/admin/hero');
};

// Contact
exports.getEditContact = async (req, res) => {
    let contact = await Contact.findOne();
    if (!contact) {
        contact = await Contact.create({});
    }
    res.render('admin/edit-contact', { contact, path: '/contact' });
};

exports.postEditContact = async (req, res) => {
    const { email, phone, address, github, linkedin, twitter, facebook, instagram } = req.body;
    let contact = await Contact.findOne();
    
    if (contact) {
        contact.email = email;
        contact.phone = phone;
        contact.address = address;
        contact.github = github;
        contact.linkedin = linkedin;
        contact.twitter = twitter;
        contact.facebook = facebook;
        contact.instagram = instagram;
        await contact.save();
    } else {
        await Contact.create({ email, phone, address, github, linkedin, twitter, facebook, instagram });
    }
    res.redirect('/admin/contact');
};

// About
exports.getEditAbout = async (req, res) => {
    const about = await About.findOne();
    res.render('admin/edit-about', { about, path: '/about' });
};

exports.postEditAbout = async (req, res) => {
    const { title, name, role, bio } = req.body;
    let about = await About.findOne();
    
    // Handle File Uploads
    let profileImage = req.body.profileImage;
    let resumeUrl = req.body.resumeUrl;

    if (req.files) {
        if (req.files.profileImage) {
            try {
                profileImage = await uploadToFirebase(req.files.profileImage[0]);
            } catch (e) { console.error(e); }
        }
        if (req.files.resume) {
            try {
                resumeUrl = await uploadToFirebase(req.files.resume[0]);
            } catch (e) { console.error(e); }
        }
    }

    if (about) {
        about.title = title;
        about.name = name;
        about.role = role;
        about.bio = bio;
        if (profileImage) about.profileImage = profileImage;
        if (resumeUrl) about.resumeUrl = resumeUrl;
        await about.save();
    } else {
        await About.create({ title, name, role, bio, profileImage, resumeUrl });
    }
    res.redirect('/admin/about');
};

// Skills
exports.getManageSkills = async (req, res) => {
    const skills = await Skill.find();
    res.render('admin/manage-skills', { skills, path: '/skills' });
};

exports.postAddSkill = async (req, res) => {
    await Skill.create(req.body);
    res.redirect('/admin/skills');
};

exports.deleteSkill = async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.redirect('/admin/skills');
};

// Projects
exports.getManageProjects = async (req, res) => {
    const projects = await Project.find();
    res.render('admin/manage-projects', { projects, path: '/projects' });
};

exports.postAddProject = async (req, res) => {
    const { title, description, techStack, githubLink, liveDemo } = req.body;
    let image = req.body.image;
    
    if (req.file) {
        try {
            image = await uploadToFirebase(req.file);
        } catch (e) { console.error(e); }
    }

    const techStackArray = techStack.split(',').map(s => s.trim());
    await Project.create({ title, description, techStack: techStackArray, githubLink, liveDemo, image });
    res.redirect('/admin/projects');
};

exports.deleteProject = async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/projects');
};

// Experience
exports.getManageExperience = async (req, res) => {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.render('admin/manage-experience', { experiences, path: '/experience' });
};

exports.postAddExperience = async (req, res) => {
    await Experience.create(req.body);
    res.redirect('/admin/experience');
};

exports.deleteExperience = async (req, res) => {
    await Experience.findByIdAndDelete(req.params.id);
    res.redirect('/admin/experience');
};