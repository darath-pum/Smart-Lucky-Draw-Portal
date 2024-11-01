-- DROP TABLE user_sessions;
-- DROP TABLE reset_passwords;
-- DROP TABLE users;
-- DROP TABLE participants;
-- DROP TABLE prizes_pool;
-- DROP TABLE won_users;
-- DROP TABLE campaigns;
-- DROP TABLE prizes;
-- DROP TABLE temp_won_users;
-- DROP TABLE campaign_invited_emails;


------------------ Table users --------------------------------
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    profile TEXT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

----------------- Table user_sessions ------------------------------
CREATE TABLE IF NOT EXISTS user_sessions(
    session_id VARCHAR(120) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip VARCHAR(120),
    session_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expired_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

--------------------- Table Reset Password -------------------------
CREATE TABLE IF NOT EXISTS reset_passwords(
    id VARCHAR(200) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    expired_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 DAY'
);

-- ------------------ Table campaigns ------------------------------
CREATE TABLE IF NOT EXISTS campaigns(
    id CHAR(6) PRIMARY KEY NOT NULL,
    campaign_name VARCHAR(120) NOT NULL,
    campaign_image TEXT NOT NULL,
    start_date TIMESTAMP DEFAULT NOW() NOT NULL,
    end_date TIMESTAMP DEFAULT NOW() NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE, 
    owner int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    number_of_chance int,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ------------------ Table campaign_invited_email -----------------------
CREATE TABLE IF NOT EXISTS campaign_invited_emails(
    id SERIAL PRIMARY KEY,
    campaign_id CHAR(6) NOT NULL,
    email VARCHAR (100) NOT NULL,
    permission VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- -- ------------------ Table participants ------------------------------
CREATE TABLE IF NOT EXISTS participants(
    id SERIAL PRIMARY KEY,
    campaign_id CHAR(6) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    msisdn VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- -- ------------------- Table prizes -----------------------------------
CREATE TABLE IF NOT EXISTS prizes(
    id CHAR(6) PRIMARY KEY NOT NULL,
    prize_image TEXT NOT NULL,
    khmer_name VARCHAR(100) NOT NULL,
    english_name VARCHAR(100) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

----------------------- Table campaign_prizes ----------------------------
CREATE TABLE IF NOT EXISTS prizes_pool(
    id SERIAL PRIMARY KEY,
    campaign_id CHAR(6) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    prize_id CHAR(6) NOT NULL REFERENCES prizes(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    used_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


------------------------- Table won_users ---------------------------------
CREATE TABLE IF NOT EXISTS won_users(
    id SERIAL PRIMARY KEY,
    campaign_id CHAR(6) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    msisdn VARCHAR(15) NOT NULL,
    prize_id CHAR(6) NOT NULL REFERENCES prizes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);


-- -------------------------- Table temp_won_users ---------------------------
CREATE TABLE IF NOT EXISTS temp_won_users(
    campaign_id VARCHAR PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
    msisdn_list VARCHAR[] NOT NULL,
    prize_id_list VARCHAR[] NOT NULL,
    qty_list INT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
