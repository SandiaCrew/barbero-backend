const apiRouter = require("express").Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");
const clientController = require("./controllers/clientController"); // Make sure to create this controller
const cors = require("cors");

apiRouter.use(cors());

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"));

// User related routes
apiRouter.post("/checkToken", userController.checkToken);
apiRouter.post("/getHomeFeed", userController.apiMustBeLoggedIn, userController.apiGetHomeFeed);
apiRouter.post("/register", userController.apiRegister);
apiRouter.post("/login", userController.apiLogin);
apiRouter.post("/doesUsernameExist", userController.doesUsernameExist);
apiRouter.post("/doesEmailExist", userController.doesEmailExist);

// Post related routes
apiRouter.get("/post/:id", postController.reactApiViewSingle);
apiRouter.post("/post/:id/edit", userController.apiMustBeLoggedIn, postController.apiUpdate);
apiRouter.delete("/post/:id", userController.apiMustBeLoggedIn, postController.apiDelete);
apiRouter.post("/create-post", userController.apiMustBeLoggedIn, postController.apiCreate);
apiRouter.post("/search", postController.search);

// Profile related routes
apiRouter.post("/profile/:username", userController.ifUserExists, userController.sharedProfileData, userController.profileBasicData);
apiRouter.get("/profile/:username/posts", userController.ifUserExists, userController.apiGetPostsByUsername);
apiRouter.get("/profile/:username/followers", userController.ifUserExists, userController.profileFollowers);
apiRouter.get("/profile/:username/following", userController.ifUserExists, userController.profileFollowing);

// Follow related routes
apiRouter.post("/addFollow/:username", userController.apiMustBeLoggedIn, followController.apiAddFollow);
apiRouter.post("/removeFollow/:username", userController.apiMustBeLoggedIn, followController.apiRemoveFollow);

// Client related routes
apiRouter.get("/client/:id", clientController.apiViewSingleClient);  // Retrieve a single client by ID
apiRouter.post("/client/:id/edit", clientController.apiUpdateClient);  // Update a specific client
apiRouter.delete("/client/:id", clientController.apiDeleteClient);  // Delete a specific client
apiRouter.post("/create-client", clientController.apiCreateClient);  // Create a new client
apiRouter.get("/clients", clientController.apiGetAllClients);  // Retrieve all clients



module.exports = apiRouter;
