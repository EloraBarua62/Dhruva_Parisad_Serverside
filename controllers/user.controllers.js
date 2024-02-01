// userControllers class is defined and called
class userControllers {

    // user signup
    signup = async(req, res) => {
        const {name, email, password} = req.body;
        console.log(name, email, password);
        res.send(200).json({message: 'signup success'})
    }
}

module.exports = new userControllers();