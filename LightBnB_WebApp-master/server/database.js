const { query } = require('express');
const { Pool } = require('pg');
const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



const properties = require('./json/properties.json');
const users = require('./json/users.json');


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


 const getUserWithEmail = function (email) {
  
  const queryString = `
  SELECT *
  FROM users
  WHERE users.email = $1;
  `;

  return pool
    .query(queryString, [email])
    .then((res) => {
      if (res.rows) {
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("query error:", err);
    });


  // Pre-existing code

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);

};

exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;

  const values = [id];

  return pool // In order to return the promise object 
    .query(queryString, values)
    .then(res => {
      console.log(res.rows[0])
      return res.rows[0]; // returns the result/response of the promise when this promise object is called in API routes
    })
    .catch(err => {
      console.log(err.message);
    })


  //Pre-existing code

  //return Promise.resolve(users[id]);

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser =  function(user) {

  const queryString = `
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3) RETURNING *`;
  
  const values = [user.name, user.email, user.password];

  return pool
    .query(queryString, values)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err.message);
    });


  // Pre-existing code

  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

}
exports.addUser = addUser;



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  const queryString = `
  SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS avg_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
  JOIN reservations ON properties.id = reservations.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date 
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  
  const values = [guest_id, limit];

  return pool
    .query(queryString, values)
    .then((res) => {
      console.log(res.rows);
      return res.rows
    })
    .catch((err) => {
      console.error(err.message);
    });
  
  
  //  Pre-existing code

  // return getAllProperties(null, 2);

};
exports.getAllReservations = getAllReservations;



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  
// array to hold any parameters that may be available for the query
const queryParams = [];

// Start the query with all information that comes before the WHERE clause
let queryString = `
SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
`;

if (options.owner_id) {
  queryParams.push(options.owner_id); // The % syntax for the LIKE clause must be part of the parameter, not the query.
  queryString += `WHERE owner_id = $${queryParams.length}` // use the length of the array to dynamically get the $n placeholder number
}

// Check if a city has been passed in as an option. 
// Add the city to the params array and create a WHERE clause for the city.
if (options.city) {
  queryParams.push(`%${options.city}%`); // The % syntax for the LIKE clause must be part of the parameter, not the query.
  if (queryParams.length > 0) {
    queryString += ` AND city LIKE $${queryParams.length}`
  } else {
    queryString += `WHERE city LIKE $${queryParams.length}` // use the length of the array to dynamically get the $n placeholder number
  }
}

if (options.minimum_price_per_night) {
  queryParams.push(options.minimum_price_per_night * 100); // The % syntax for the LIKE clause must be part of the parameter, not the query.
  if (queryParams.length > 0) {
    queryString += ` AND cost_per_night >= $${queryParams.length}`
  } else {
    queryString += `WHERE cost_per_night >= $${queryParams.length}`
  }
}

if (options.maximum_price_per_night) {
  queryParams.push(options.maximum_price_per_night * 100); // The % syntax for the LIKE clause must be part of the parameter, not the query.
  if (queryParams.length > 0) {
    queryString += ` AND cost_per_night <= $${queryParams.length}`
  } else {
    queryString += `WHERE cost_per_night <= $${queryParams.length}`
  }
}

queryString += `
GROUP BY properties.id
`;

if (options.minimum_rating) {
  queryParams.push(options.minimum_rating); // The % syntax for the LIKE clause must be part of the parameter, not the query.
  queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`
}

// Add any query that comes after the WHERE clause
queryParams.push(limit);
queryString += `
ORDER BY cost_per_night
LIMIT $${queryParams.length};
`;

console.log(queryString, queryParams);

return pool
  .query(queryString, queryParams)
  .then((result) => result.rows)
  .catch((err) => console.log("ERROR:", err.message));
 
  
// Modified for previous assignment 
  
// return pool
//   .query(`SELECT * FROM properties LIMIT $1;`, [limit])
//   .then((result) => result.rows)
//   .catch((err) => {
//     console.log(err.message);
//   });


// Pre-existing code

// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
// exports.getAllProperties = getAllProperties;

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
  
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool
    .query(queryString, values)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err.message);
    });


  // Pre-existing code
  
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);

};
exports.addProperty = addProperty;
