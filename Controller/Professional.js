const Professional = require("../Model").professionals
const slug = require('slug')
const fs = require('fs');
const path = require('path');

exports.CreateProfessional = async (req, res) => {
    try {
        const { fullname, role } = req.body;
        if (!fullname || !role) return res.json({ status: 400, msg: 'Incomplete Request detected' });

        const sanitizedfullname = slug(fullname, '_');

        const checkprofessional = await Professional.findOne({ where: { fullname: fullname } });
        if (checkprofessional) return res.json({ status: 400, msg: 'Professional already exists!..' });

        const image = req.files ? req.files.image : null;
        if (image && !image.mimetype.startsWith('image/')) {
            return res.json({ status: 400, msg: 'Image must be a valid image file' });
        }

        const professionalPath = './Public/professional';
        if (!fs.existsSync(professionalPath)) {
            fs.mkdirSync(professionalPath);
        }

        const date = new Date();
        const fileName = image ? `prof_${sanitizedfullname}_${date.getTime()}.png` : null;

        if (image) {
            await image.mv(path.join(professionalPath, fileName));
        }

        const newProfessional = { fullname: fullname, role: role, image: fileName };
        await Professional.create(newProfessional);

        return res.json({ status: 200, msg: 'Professional Created Successfully' });
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` });
    }
};

exports.UpdateProfessional = async (req, res) => {
    try {
        const { id } = req.params;

        const { fullname, role } = req.body;
        if (!fullname || !role) return res.json({ status: 400, msg: 'Incomplete Request detected' });

        const checkprof = await Professional.findOne({ where: { id: id } });
        if (!checkprof) return res.json({ status: 404, msg: 'Professional not found!..' });

        const image = req.files ? req.files.image : null;
        let imageName;

        if (image) {
            const oldImagePath = `./Public/professional/${checkprof.image}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            const date = new Date();
            const fileName = `prof_${slug(fullname, '_')}_${date.getTime()}.png`;
            await image.mv(path.join('./Public/professional', fileName));
            imageName = fileName;
        } else {
            imageName = checkprof.image;
        }

        checkprof.fullname = fullname;
        checkprof.role = role;
        checkprof.image = imageName;

        await checkprof.save();

        return res.json({ status: 200, msg: 'Professional Updated Successfully' });
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` });
    }
};

exports.AllProfessional = async (req, res) => {
    try {
        const items = await Professional.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.json({ status: 200, msg: items });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
};

exports.SingleProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.json({ status: 400, msg: 'ID is required' });

        const items = await Professional.findOne({
            where: { id: id }
        });

        if (!items) return res.json({ status: 404, msg: 'Professional not found!' });

        return res.json({ status: 200, msg: items });
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` });
    }
};
exports.DeleteProfessional = async (req, res) => {
    try {
        const { id } = req.body;

        const prof = await Professional.findOne({ where: { id } });
        if (!prof) return res.json({ status: 404, msg: `Professional Not Found` });

        await prof.destroy();

        return res.json({ status: 200, msg: `Professional Deleted Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error: ${error}` });
    }
};
