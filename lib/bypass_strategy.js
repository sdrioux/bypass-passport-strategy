var passport = require('passport-strategy')
var util = require('util');
var BypassAuth = require('./bypass_auth.js');


  /**
 * `BypassStrategy` constructor.
 *
 * The bypass authentication strategy authenticates requests based on the
 * session token submitted in the Bypass custom headers.
 *
 * Unlike most Passport strategies, this does not require a verify method,
 * as we automatically conform the the Bypass session token strategy.
 *
 * Examples:
 *
 *     passport.use(new BypassStrategy());
 *
 * @api public
 */
function BypassStrategy() {
  this.BYPASS_SESSION_HEADER = "x-session-token";
  this.name = 'bypasstoken';
  passport.Strategy.call(this);
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request.
 *
 *
 * @param {Object} req The request to authenticate.
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
BypassStrategy.prototype.authenticate = function(req, options) {
  var key;
  if (req.headers[this.BYPASS_SESSION_HEADER]) {
    key = req.headers[this.BYPASS_SESSION_HEADER];
  } else {
    var error = new Error('No token found.');
    error.name = 'ENOTFOUND';
    return this.fail(error);
  }

  var self = this;

  BypassAuth.login(apiKey).then(function(user) {
    if (user) {
      self.success(user);
    } else {
      self.error("Unauthorized");
    }
  }).catch(function() {
    self.error("err");
  });

  // this.fail(info)
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;