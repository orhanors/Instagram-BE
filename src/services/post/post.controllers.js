const ObjectId = require('mongodb').ObjectID;
const PostModel = require("./post.schema");

exports.newPost = async (req, res, next) => {
	try {
		const userId = await req.user_id
		console.log(req.user._id,"userId")
		console.log(ObjectId(req.user._id),"objectId")
		const imgUrl = req.file.path;
		const newPost = await PostModel({ 
			user:ObjectId(req.user._id),
			 image: imgUrl,
			
			  });
		const { _id } = await newPost.save();
		console.log(_id,"my id")
		console.log("insidepost",req.user._id)
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
		console.log(req.user._id)
        const myPosts = await PostModel.find({user:req.user._id})
        console.log(myPosts,"asds")
		res.send(myPosts)
	} catch (error) {
		next(error);
	}
};
exports.getAllPosts = async (req, res, next) => {
	try {
		// first find my following ids
		let allPosts = []
		console.log(req.user.following,"here")
		for(let i=0;i<req.user.following.length;i++){
			const post = await PostModel.find({user:req.user.following[i]})
			allPosts.push(post)
		}
		const myPosts = await PostModel.find({user:req.user._id})
		allPosts.push(myPosts)
		//then find all the posts of them
		// sort by date pending !!!!
		// send the respond
		
		res.send(allPosts);
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

exports.addLike = async(req,res,next)=>{
	try {
		const findmyLike= await PostModel.findOne({_id:req.params.postId})
		let liked=false
		console.log(findmyLike,"asdsdas")
		for(let i = 0;i<findmyLike.likes.length;i++){
			if(findmyLike.likes[i]._id===req.user._id){
				liked=true
				
			}

		}
		if(liked===true){
			const findPost = await PostModel.findByIdAndUpdate(req.params.postId,{
				$push:{
					likes:[
						{
							_id:req.user._id,
							name:req.user.name,
							surname:req.user.surname,
							image:req.user.image
						}
					]
				}
				
			},{runValidators:true,new:true,}
			)
			res.send(findPost)
		}else{
			const posts = await PostModel.findByIdAndUpdate(
				req.params.postId,
				{
				  $pull: {
					likes: {
					  _id: req.user._id,
					},
				  },
				},
				{
				  runValidators: true,
				  new: true,
				}
			  );
			  res.send(posts);
		}
		console.log(liked)
		
	} catch (error) {
		next(error)
	}
}
exports.removeLike = async(req,res,next)=>{
	try {
		const posts = await PostModel.findByIdAndUpdate(
			req.params.postId,
			{
			  $pull: {
				likes: {
				  _id: req.params.likeId,
				},
			  },
			},
			{
			  runValidators: true,
			  new: true,
			}
		  );
		  res.send(posts);
	} catch (error) {
		next(error)
	}
}