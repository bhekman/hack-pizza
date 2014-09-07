// Note that this function will become more complex when
// non-local authentication methods are added in.
module.exports = function getCurrentUser(req) {
  return req.user.local.email;
}

