// Defines different routes

const routes = require('next-routes')(); //return a function and () means execute it

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/list-contribute', '/campaigns/list-contribute/index')
    .add('/campaigns/:address/rating-campaign', '/campaigns/rating-campaign/index')
    .add('/campaigns/:address/rating-campaign/newRating', '/campaigns/rating-campaign/newRating')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;