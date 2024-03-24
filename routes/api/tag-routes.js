const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
	// find all tags
	// be sure to include its associated Product data
	try {
		const tagData = await Tag.findAll({
			include: [
				{
					model: Product,
					as: "products",
				},
			],
		});
		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	// find a single tag by its `id`
	// be sure to include its associated Product data
	try {
		const tagData = await Tag.findByPk(req.params.id, {
			include: [
				{
					model: Product,
					as: "products",
				},
			],
		});
		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", async (req, res) => {
	/* req.body should look like this...
    {
      tag_name: "purple"
    }
  */
	try {
		const tagData = await Tag.create(req.body);
		res.status(200).json(tagData);
	} catch (err) {
		res.status(400).json(err);
	}
});

router.put("/:id", (req, res) => {
	// update a tag's name by its `id` value
	Tag.update(req.body, {
		where: {
			id: req.params.id,
		},
	})
		.then((tag) => {
			if (req.body.tagIds && req.body.tagIds.length) {
				Tag.findAll({
					where: { tag_id: req.params.id },
				}).then((tags) => {
					// create filtered list of new tag_ids
					const tagIds = tags.map(({ tag_id }) => tag_id);
					const newTags = req.body.tagIds
						.filter((tag_id) => !tagIds.includes(tag_id))
						.map((tag_id) => {
							return {
								tag_id: req.params.id,
								tag_id,
							};
						});

					// figure out which ones to remove
					const tagsToRemove = tags
						.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
						.map(({ id }) => id);
					// run both actions
					return Promise.all([
						Tag.destroy({ where: { id: tagsToRemove } }),
						Tag.bulkCreate(newTags),
					]);
				});
			}

			return res.json(tag);
		})
		.catch((err) => {
			// console.log(err);
			res.status(400).json(err);
		});
});

router.delete("/:id", async (req, res) => {
	// delete on tag by its `id` value
	try {
		const tagData = await Tag.destroy({
			where: { id: req.params.id },
		});
		if (!tagData) {
			res.status(404).json({ message: "No category with this id!" });
			return;
		}
		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
