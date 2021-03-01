const PostModel = require("./post.schema");

exports.newPost = async (req, res, next) => {
	try {
		const imgUrl = req.file.path;
		const newPost = await PostModel({ ...req.body, image: imgUrl });
		const { _id } = newPost.save();
		res.send(_id);
	} catch (error) {
		next(error);
	}
};

exports.getSpecificPost = async (req, res, next) => {
	try {
		const specificPost = await PostModel.findById(req.params.postId);
		res.status(200).send(specificPost);

		console.log(specificPost);
	} catch (error) {
		next(error);
	}
};

exports.getAllMyPosts = async (req, res, next) => {
	try {
        console.log(req.user)
		res.send("okej")
	} catch (error) {
		next(error);
	}
};
exports.getAllPosts = async (req, res, next) => {
	try {
		// this one is tricky with following . PENDING
		res.send("Ok");
	} catch (error) {
		next(error);
	}
};
exports.editSinglePost = async (req, res, next) => {
	try {
		if (req.file && req.file.path) {
			const editPost = await PostModel.findByIdAndUpdate(
				req.params.postId,
				{
					$set: {
						image: req.file.path,
					},
				}
			);
			const { _id } = await editPost.save();
			res.status(201).send(_id);
		} else {
			const editPost = await PostModel.findByIdAndUpdate(
				req.params.postId,
				{
					$set: {
						description: req.body.description,
					},
				}
			);
			const { _id } = await editPost.save();
			res.status(201).send(_id);
		}
	} catch (error) {
		next(error);
	}
};
exports.deletePost = async (req, res, next) => {
	try {
		const deletePost = await PostModel.findByIdAndDelete(req.params.postId);
		res.status(204).send("Deleted");
	} catch (error) {
		next(error);
	}
};
