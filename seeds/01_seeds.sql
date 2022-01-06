--users
INSERT INTO users (name, email, password) 
VALUES ('Eva Stanley', 'estanley@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', 'meyer@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sue Luna', 'sluna@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

--properties
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (10, 'Fun glad', 'description', 'https://images.pexels.com/photos/2076739/pexels-photo-2076739.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2076739/pexels-photo-2076739.jpeg', 1500, 1, 3, 3, 'United States', '77 Street', 'New York', 'New York', '90000'),
(11, 'Shine twenty', 'description', 'https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg', 2500, 0, 2, 2, 'Canada', '88 Street', 'Vancouver', 'British Columbia', '90001'),
(12, 'Game fill', 'description', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg', 4000, 4, 3, 4, 'United States', '99 Street', 'San Francisco', 'California', '90002');

--reservations
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-08-11', '2019-08-26', 1, 10),
('2020-01-04', '2020-02-04', 2, 11),
('2021-10-01', '2021-10-14', 3, 12);

--reviews
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (10, 1, 1, 5, 'messages'), (11, 2, 2, 5, 'messages'), (12, 3, 3, 5, 'messages');