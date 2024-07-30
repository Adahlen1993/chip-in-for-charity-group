CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
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
    admin BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user" (email);

CREATE TABLE IF NOT EXISTS discounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS restrictions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS golf_courses (
    id BIGSERIAL PRIMARY KEY,
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
    id BIGSERIAL PRIMARY KEY,
    golf_course_id BIGINT NOT NULL,
    discount_id BIGINT NOT NULL,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    UNIQUE (golf_course_id, discount_id)
);

CREATE TABLE IF NOT EXISTS golf_courses_restrictions (
    id BIGSERIAL PRIMARY KEY,
    golf_course_id BIGINT NOT NULL,
    restriction_id BIGINT NOT NULL,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (restriction_id) REFERENCES restrictions(id) ON DELETE CASCADE,
    UNIQUE (golf_course_id, restriction_id)
);

CREATE TABLE IF NOT EXISTS punch_card (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    is_purchased BOOLEAN NOT NULL DEFAULT false,
    purchased_date TIMESTAMP DEFAULT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Punch Card',
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_punch_card_user_id ON punch_card (user_id);

CREATE TABLE IF NOT EXISTS punch_card_golf_courses (
    id BIGSERIAL PRIMARY KEY,
    punch_card_id BIGINT NOT NULL,
    golf_course_id BIGINT NOT NULL,
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_date TIMESTAMP,
    discount_id BIGINT NOT NULL,
    FOREIGN KEY (punch_card_id) REFERENCES punch_card(id) ON DELETE CASCADE,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    UNIQUE (punch_card_id, golf_course_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status BOOLEAN NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);


