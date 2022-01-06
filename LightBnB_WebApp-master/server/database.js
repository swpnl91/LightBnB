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
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1;`, [limit])
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });

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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
