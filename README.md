# Instagram Web Clone Backend

Instagram web clone is a web application which is implemented using NodeJs,ExpressJs,PassportJs,JWT and MongoDB. Frontend side of this project can be found [here](https://github.com/orhanors/Instagram-FE)

Under the [services](https://github.com/orhanors/Instagram-BE/tree/master/src/services) folder you can find the services that is implemented for this project

### Services

<details>
<summary><b> Authentication/Authorization </b></summary>
    <p> This service includes auth/oauth implementation using jwt refresh token strategy </p>
    <p> PassportJs used for facebook oauth implementation </p>
    <p> Access tokens have 15m to expire and refresh tokens have 1week </p>
    <p> Tokens exist on httpOnly cookies. Nobody could access this tokens except your API call tool. </p>
    Here is the middleware that we're using for validating user tokens inside of our protected route:
    
```javascript
   const validateToken = async (req, res, next) => {
	try {
		let token = req.cookies.token;

		const decoded = await verifyJWT(token);

		const user = await UserModel.findOne({
			_id: decoded._id,
		})
			.populate({
				path: "followers",
				select: "-refreshTokens -__v -password",
			})
			.populate({
				path: "following",
				select: "-refreshTokens -__v -password",
			});

		if (!user) {
			throw new ApiError(401, "Unauthorized");
		}

		req.token = token;
		req.user = user;

		next();
	} catch (e) {
		next(new ApiError(401, "Unauthorized"));
	}
};
```
</details>



<details>
<summary><b> Conversation </b></summary>

```javascript
    const ConversationSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	members: [{ id: String, socketId: String }],
	messages: [
		{
			sender: { type: String },
			receiver: { type: String },
			msg: { type: String },
		},
	],
});
```

<p> Conversation service is implementation of DM feature of instagram </p>
<p> Implemented using socket.io and rooms </p>
<p> Everytime when one user starts a conversation we generate a unique conversation name which contains both user id (user1Id@user2Id).So, if user1 starts a conversation
with user2 they will join same room and user2 won't be able to create same room again </p>

```javascript
  const generateUniqueRoomName = (user1, user2) => {
  const users = [user1, user2];

	let unique = [...new Set(users)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']
	let updatedRoomName = `${unique[0]}@${unique[1]}`;

	return updatedRoomName;
};
```
<p> Tokens exist on httpOnly cookies. Nobody could access this tokens except your API call tool. </p>
</details>

<details>
<summary><b> Post </b></summary>

<p> Users are able to upload image posts with a description</p>
<p> Cloudinary is used for image uploading. Here is the middleware implementation of cloudinary:  </p>

```javascript
cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "striveTest",
	},
});

const cloudinaryMulter = multer({ storage: storage });

module.exports = cloudinaryMulter;
```

If we want to use <strong>cloudinaryMulter</strong> middleware in route it's easy peasy. We just need to call this middleware with an option like "single" or "array".

```javascript
userRouter.put("/me/update/image",cloudinaryMulter.single("image"),validateToken,editUserImage);
```
In the <strong>editUserImage</strong> controller, we are able to see "req.file.path" parameter which contains uploaded image url.

</details>


<details>
<summary><b> Follow-Unfollow </b></summary>

<p> This feature exists under the user service </p>
<p> If user1 wants to follow user2, user1 should have user2's ID in following array and user2 should have user1's ID in followers array. 
All these processes combined in Promise.all to make them work together. If one of operation is fail we won't see any change in database
Here is the implementation of following feature.  </p>


```javascript
exports.follow = async (req, res, next) => {
	try {
		const { followedUserId } = req.params;
		const currentUser = req.user;
		const followedUser = await UserModel.findById(followedUserId);

		if (!followedUser)
			throw new ApiError(404, "Followed User user is not found");

		currentUser.following.push(followedUser);
		followedUser.followers.push(currentUser._id);

		if (currentUser._id.toString() === followedUser._id.toString())
			throw new ApiError(400, "Users are same");
		const newNotification = await addFollowNotification(
			currentUser,
			followedUser
		); //Create a new notification for followed user

		//If one of them fails send error
		Promise.all([
			await currentUser.save(),
			await followedUser.save(),
			await newNotification.save(),
		])
			.then((result) => res.status(200).send("Ok"))
			.catch((e) => next(new ApiError()));
	} catch (error) {
		console.log("follow error: ", error);
		next(error);
	}
};
```
</details>


<details>
<summary><b> Notification </b></summary>

<p> Notification service was implemented using classic HTTP protocol. No websockets. Sorry for that. Next version will be imlemented with sockets </p>
<p> If user1 follows user2, user2 will see a notification from user1. Same for likes. If user1 likes user2's post user2 will have notification for this event </p>
<p> Here is the notification schema. It's seperated as following notifications and post notifications: </p>


```javascript
onst NotificationSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	follows: [
		{
			id: String,
			username: String,
			image: String,
			seen: { type: Boolean, default: false },
			time: { type: Date, default: Date.now() },
		},
	],
	posts: [
		{
			userId: String,
			postId: String,
			like: Boolean,
			comment: Boolean,
			username: String,
			seen: { type: Boolean, default: false },
			time: { type: Date, default: Date.now() },
		},
	],
});
```
</details>

### Deployment

<details>
<summary><b> Azure DevOps Pipeline </b></summary>
	<p> Deployed on Azure Web Apps Service. Also created DevOps pipeline but it doesn't contain tests. Next feature will be implementation of Unit and Integration tests </p>
</details>
