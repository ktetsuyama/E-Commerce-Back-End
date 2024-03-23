const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
	// find all categories
	// be sure to include its associated Products
	try {
		const categorytData = await Category.findAll({
			include: [
				{
					model: Product,
					as: "products",
				},
			],
		});
		res.status(200).json(categorytData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	// find one category by its `id` value
	// be sure to include its associated Products
	try {
		const categorytData = await Category.findByPk(req.params.id, {
			include: [
				{
					model: Product,
					as: "products",
				},
			],
		});
		res.status(200).json(categorytData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", (req, res) => {
	// create a new category
});

router.put("/:id", (req, res) => {
	// update a category by its `id` value
});

router.delete("/:id", async (req, res) => {
	// delete a category by its `id` value
	try {
		const categoryData = await Category.destroy({
			where: { id: req.params.id },
		});
		if (!categoryData) {
			res.status(404).json({ message: "No category with this id!" });
			return;
		}
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
