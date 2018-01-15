var hapi = require('hapi');
var _ = require('lodash');
const Boom = require('boom');
const Path = require('path');
const Handlebars = require('handlebars');
const Inert = require('inert');

var port = 3000;

// Create hapi server instance
var server = new hapi.Server();


// add frontend connection parameters
var backend = server.connection({
    host: 'localhost',
    port: process.env.PORT + 1 || port + 1,
    labels: 'backend'
});


// add backend-only route
backend.route({
    method: 'GET',
    path: '/status',
    handler: function (request, reply) {
        return reply('ok');
    }
});

// register hapi-auth-jwt plugin only for backend
backend.register({
    register: require('hapi-auth-jwt')
}, function (err) {
    if (err) {
        throw err;
    }

    backend.auth.strategy('token', 'jwt', {
        key: 'supersecretkey',
        validateFunc: function (decodedToken, callback) {
            console.log('jwt validate function')
        }
    });
});

// Start the server
server.start(function () {
    // Log to the console the host and port info
    _.forEach(server.connections, function (connection) {
        console.log('Server started at: ' + connection.info.uri);
    });
});

