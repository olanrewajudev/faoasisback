const slug = require("slug");
const Price = require("../Model").prices;
const Category = require("../Model").categories;
const Section = require("../Model").sections;
const Subsection = require("../Model").subsections;
const fs = require("fs");
const path = require('path');

exports.AddNewPrice = async (req, res) => {
    try {
        const { content, service, priceamount, maincategory, category } = req.body;
        if (!content)
            return res.json({ status: 400, msg: `content Information detected` });
        if (!service)
            return res.json({ status: 400, msg: `service Information detected` });
        if (!priceamount)
            return res.json({ status: 400, msg: `price Information detected` });
        if (!maincategory)
            return res.json({ status: 400, msg: `category Information detected` });

        const slugged = slug(service, "-");
        const newitem = {
            slug: slugged,
            content,
            service,
            maincategory,
            category,
            priceamount,
        };
        await Price.create(newitem);

        return res.json({ status: 200, msg: `Price published successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
};

exports.UpdatePrice = async (req, res) => {
    try {
        const {
            content,
            id,
            service,
            priceamount,
            category,
            maincategory,
        } = req.body;
        if (!content || !priceamount || !service || !maincategory)
            return res.json({ status: 400, msg: `Incomplete Information detected` });

        const price = await Price.findOne({
            where: { id: id },
        });
        if (!price) return res.json({ status: 400, msg: `price not found` });

        price.slug = slug(service, "-");
        price.service = service;
        price.content = content;
        price.category = category;
        price.maincategory = maincategory;
        price.priceamount = priceamount;
        await price.save();

        return res.json({ status: 200, msg: `Price Updated Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
}
exports.DuplicatePrice = async (req, res) => {
    try {
        const { id } = req.body
        const price = await Price.findOne({
            where: { id: id },

        })
        if (!price) return res.json({ status: 404, msg: `price Not Found` })

        const priceSlug = slug(price.service, '_')
        const newPrice = { service: price.service, category: price.category, maincategory: price.maincategory, content: price.content, priceamount: price.priceamount, slug: priceSlug }
        await Price.create(newPrice)

        return res.json({ status: 200, msg: `price Duplicated Successfully!...` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.AllPriceByCategory = async (req, res) => {
    try {
        const { cart } = req.params;
        const items = await Price.findAll({
            where: { maincategory: cart },
            order: [["createdAt", "DESC"]],
            include: [{ model: Category, as: "cart" }],
        });

        const item = await Category.findOne({ where: { id: cart } });
        if (!item) return res.json({ status: 404, msg: `Category not found` });

        return res.json({ status: 200, msg: items, category: item });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
};

exports.GetSinglePrice = async (req, res) => {
    try {
        const price = await Price.findOne({ where: { id: req.params.id } });
        if (!price) return res.json({ status: 404, msg: `price not found` });

        return res.json({ status: 200, msg: price });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
};
exports.AllPrice = async (req, res) => {
    try {
        const items = await Price.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: Category, as: 'cart' },
            ],
        })

        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.DeletePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const price = await Price.findOne({ where: { id: id } });
        if (!price) return res.json({ status: 404, msg: `price not found` });
        await price.destroy();

        return res.json({ status: 200, msg: `Price Deleted Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
}

//section
exports.AddNewSection = async (req, res) => {
    try {
        const { title, prices } = req.body;

        const sanitizedTitle = slug(title, '_');

        const findSection = await Section.findOne({ where: { title: sanitizedTitle } });
        if (findSection) return res.json({ status: 400, msg: `A section with this title already exists` });

        const image = !req.files ? null : req.files.image
        if (image && !image.mimetype.startsWith('image/')) {
            return res.json({ status: 400, msg: `Image must be a valid image file` });
        }

        const sectionsPath = './Public/sections'
        if (!fs.existsSync(sectionsPath)) {
            fs.mkdirSync(sectionsPath);
        }

        const date = new Date();
        const fileName = image ? `section_${sanitizedTitle}_${date.getTime()}.png` : null;

        if (image) {
            await image.mv(path.join(sectionsPath, fileName));
        }

        const section = await Section.create({
            title: sanitizedTitle,
            slug: sanitizedTitle,
            image: fileName,
        });

        if (prices && prices.length > 0) {
            for (const priceId of prices) {
                const findPrice = await Price.findOne({ where: { id: priceId } });
                if (findPrice) {
                    const findSubSection = await Subsection.findOne({ where: { price: priceId, section: section.id } });
                    if (!findSubSection) {
                        await Subsection.create({ price: priceId, section: section.id });
                    }
                }
            }
        }

        return res.json({ status: 200, msg: `Section Created Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Server error: ${error}` });
    }
};
exports.AllSections = async (req, res) => {
    try {
        const items = await Section.findAll({
            order: [['createdAt', 'DESC']]
        })

        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.SingleSectionForUpdating = async (req, res) => {
    try {
        const { id } = req.params
        const sec = await Section.findOne({ where: { id: id } })
        if (!sec) return res.json({ status: 404, msg: `Section Not found` })

        // finding subsections
        const subs = await Subsection.findAll({ where: { section: sec.id } })
        const arr = []
        subs.map((item) => {
            arr.push(item.price)
        })

        return res.json({ status: 200, msg: arr, sec })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.UpdateSection = async (req, res) => {
    try {
        const { title, id, prices } = req.body;

        const sec = await Section.findOne({ where: { id } });
        if (!sec) return res.json({ status: 400, msg: `Section does not exist` });

        const image = !req.files ? null : req.files.image
        let imageName;

        if (image) {
            const path = `./public/sections/${sec.image}`
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            const date = new Date()
            const fileName = `section_${title}_${date.getTime()}.png`
            await image.mv(`./public/sections/${fileName}`)
            imageName = fileName
        } else {
            imageName = sec.image
        }

        const secSlug = slug(title, '_')
        sec.title = title
        sec.slug = secSlug  
        sec.image = imageName  

        await sec.save();

        if (prices && prices.length > 0) {
            await Subsection.destroy({ where: { section: sec.id } });

            for (const priceId of prices) {
                const findPrice = await Price.findOne({ where: { id: priceId } });
                if (findPrice) {
                    await Subsection.create({ price: priceId, section: sec.id });
                }
            }
        }

        return res.json({ status: 200, msg: `Section Updated Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error: ${error}` });
    }
};


exports.DeleteSection = async (req, res) => {
    try {
        const { id } = req.body;

        const sec = await Section.findOne({ where: { id } });
        if (!sec) return res.json({ status: 404, msg: `Section Not Found` });

        await Subsection.destroy({ where: { section: sec.id } });

        await sec.destroy();

        return res.json({ status: 200, msg: `Section Deleted Successfully` });
    } catch (error) {
        return res.json({ status: 400, msg: `Error: ${error}` });
    }
};


exports.GetHomeSections = async (req, res) => {
    try {

        const sections = await Section.findAll({
            include: [
                {
                    model: Subsection, as: 'secs', include: [
                        { model: Price, as: 'secprice', }
                    ]
                }
            ]
        })

        return res.json({ status: 200, msg: sections })
    } catch (error) {
        return res.json({ status: 400, mg: `Error ${error}` })
    }
}
