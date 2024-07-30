CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Ensure this is hashed and salted
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    birthdate DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);

CREATE TABLE IF NOT EXISTS discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS golf_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    image_url TEXT
);
CREATE INDEX IF NOT EXISTS idx_golf_courses_name ON golf_courses (name);

CREATE TABLE IF NOT EXISTS golf_courses_discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    golf_course_id UUID NOT NULL,
    discount_id UUID NOT NULL,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    UNIQUE (golf_course_id, discount_id)
);

CREATE TABLE IF NOT EXISTS golf_courses_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    golf_course_id UUID NOT NULL,
    restriction_id UUID NOT NULL,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (restriction_id) REFERENCES restrictions(id) ON DELETE CASCADE,
    UNIQUE (golf_course_id, restriction_id)
);

CREATE TABLE IF NOT EXISTS punch_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    is_purchased BOOLEAN NOT NULL DEFAULT false,
    purchased_date TIMESTAMP DEFAULT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Punch Card',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_punch_card_user_id ON punch_cards (user_id);

CREATE TABLE IF NOT EXISTS punch_card_golf_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    punch_card_id UUID NOT NULL,
    golf_course_id UUID NOT NULL,
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_date TIMESTAMP,
    discount_id UUID NOT NULL,
    FOREIGN KEY (punch_card_id) REFERENCES punch_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    UNIQUE (punch_card_id, golf_course_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status BOOLEAN NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
