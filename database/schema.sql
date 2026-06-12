CREATE DATABASE IF NOT EXISTS studyforge_ai_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE studyforge_ai_db;

CREATE TABLE IF NOT EXISTS study_topics (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(180) NOT NULL,
    original_text TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS generated_contents (
    id BIGINT NOT NULL AUTO_INCREMENT,
    type VARCHAR(40) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    study_topic_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_generated_contents_study_topic
        FOREIGN KEY (study_topic_id)
        REFERENCES study_topics (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_generated_contents_type
        CHECK (type IN ('SUMMARY', 'QUIZ', 'FLASHCARDS', 'SIMPLIFIED_EXPLANATION'))
);
