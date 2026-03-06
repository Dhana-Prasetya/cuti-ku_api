CREATE TYPE role_enum AS ENUM ('employee', 'admin'); -- Constant choice for role
CREATE TYPE status_enum AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- For native uuid


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role role_enum NOT NULL DEFAULT 'user',
    enabled boolean default true,
    created_at timestamp with time zone default now()
);

CREATE TABLE paid_leave (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    attachment_url VARCHAR(500) not null,
    status status_enum NOT NULL DEFAULT 'Pending',
    rejection_reason varchar(500),
    approved_by UUID REFERENCES users(id) on delete restrict,
    created_at timestamp with time zone default now(),
    CONSTRAINT check_dates CHECK (end_date >= start_date),
    CONSTRAINT check_future_start CHECK (start_date >= CURRENT_DATE - INTERVAL '1 day')
);

CREATE TABLE leave_balances (
    user_id UUID REFERENCES users(id) ON DELETE cascade,
    year INT NOT NULL,
    total_allowed INT DEFAULT 12 CHECK (total_allowed >= 0 AND total_allowed <= 12),
    taken INT DEFAULT 0 CHECK (taken <= total_allowed),
    PRIMARY KEY (user_id, year)
);

ALTER TABLE paid_leave 
ADD CONSTRAINT exclude_overlapping_leave 
EXCLUDE USING gist (
  user_id WITH =,
  ( daterange(start_date, end_date, '[]') ) WITH &&
);