var User = /** @class */ (function () {
    function User(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
    return User;
}());
export { User };
//# sourceMappingURL=user.js.map