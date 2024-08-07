const User = require('../model/user');
const UserNotification = require('../model/Usernotifications')
exports.loginUser = async (req, res) => {
    console.log(req.body);
    const { userId, loginPhone } = req.body;
    
    if (!userId || !loginPhone) {
        console.log('Missing required fields', req.body);
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        // Check if a user with the same phone number exists
        let existingUser = await User.findOne({ phone: loginPhone });

        if (existingUser) {
            // If user with the same phone number exists, return the existing user's userId
            return res.status(200).json({ userId: existingUser.userId, message: 'User logged in successfully' });
        }

        let existingUser1 = await User.findOne({ userId });

        if (existingUser1) {
            // If user with the same phone number exists, return the existing user's userId
            return res.status(200).json({ userId: existingUser1.userId, message: 'User logged in successfully' });
        }
        // If user does not exist, create a new user
        const newUser = new User({
            userId: userId,
            phone: loginPhone,
        });

        await newUser.save();
        res.status(201).json({ userId: newUser.userId, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error saving User:', error);
        res.status(400).json({ error: 'An error occurred while registering the User' });
    }
};
exports.logoutUser =async(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
      });
    
      // For token-based authentication, you might need to handle token invalidation
      // Example: Add the token to a blacklist or similar mechanism
    };



    exports.getNotifications =async(req,res) =>{
        try {
          const { userId } = req.params;
          const Usernotifications = await UserNotification.find({ UserId: userId });
          console.log(req.params);
          res.status(200).json(Usernotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          res.status(500).json({ error: 'An error occurred while fetching notifications' });
        }
      }

      exports.markAsRead = async (req, res) => {
        try {
          const { notificationId } = req.params;
          await UserNotification.findByIdAndUpdate(notificationId, { read: true });
          res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
          res.status(500).json({ message: 'Error marking notification as read', error });
        }
      };

      exports.fetchuserdetails = async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ userId }); // Adjust the query to find by userId
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'An error occurred while fetching user' });
        }
    };