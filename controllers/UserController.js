module.exports = function UserController(opts) {

    const {
        userService
    } = opts;

    async function getUser (req, res) {
        const result = await userService.getUser();
        res.status(201).send(result)
    }

    return {
        getUser
    }
}