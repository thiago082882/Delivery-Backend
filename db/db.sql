DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLES roles(

id BIGSERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL UNIQUE,
image VARCHAR(255) NULL,
route VARCHAR(255) NULL,
created_at TIMESTAMP(0) NOT NULL,
updated_at TIMESTAMP (0) NOT NULL	

);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255)NOT NULL,
	lastname VARCHAR (255) NOT NULL,
	phone VARCHAR(45) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	notification_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP (0) NOT NULL		
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLES user_has_roles (
	
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP (0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE  CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE  CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user,id_rol)


);

INSERT INTO roles(
    name,
	route,
	image,
	created_at,
	updated_at
)
VALUES (
   'CLIENTE',
	'client/home',
	'https://images.freeimages.com/fic/images/icons/61/dragon_soft/512/user.png',
	'2023-02-22',
	'2023-02-22'
);

INSERT INTO roles(
    name,
	route,
	image,
	created_at,
	updated_at
)
VALUES (
   'RESTAURANTE',
	'restaurant/home',
	'https://cdn-icons-png.flaticon.com/512/1996/1996068.png',
	'2023-02-22',
	'2023-02-22'
);

INSERT INTO roles(
    name,
	route,
	image,
	created_at,
	updated_at
)
VALUES (
   'ENTREGADOR',
	'delivery/home',
	'https://cdn-icons-png.flaticon.com/512/1371/1371646.png',
	'2023-02-22',
	'2023-02-22'
);


DROP TABLE IF EXISTS categorias CASCADE;
CREATE TABLE categorias(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL UNIQUE,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL

);


DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  price DECIMAL DEFAULT 0,
  image1 VARCHAR(255) NOT NULL,
  image2 VARCHAR(255) NULL,
  image3 VARCHAR(255) NULL,
  id_category BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_category) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE CASCADE

);


DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
  id BIGSERIAL PRIMARY KEY,
  id_user BIGINT NOT NULL,
  address VARCHAR(255) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  lat DECIMAL DEFAULT 0,
  lng DECIMAL DEFAULT 0,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

);


DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
	id BIGSERIAL PRIMARY KEY,
	id_client BIGINT NOT NULL,
	id_delivery BIGINT NULL,
	id_address BIGINT NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	status VARCHAR(90) NOT NULL,
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
	id_order BIGINT NOT NULL,
	id_product BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	PRIMARY KEY(id_order, id_product),
	FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);