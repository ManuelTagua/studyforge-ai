USE studyforge_ai_db;

INSERT INTO study_topics (title, original_text, created_at, updated_at)
VALUES
    (
        'Example topic',
        'Paste your study notes here. This seed row is only for local development.',
        NOW(6),
        NOW(6)
    );

INSERT INTO generated_contents (type, content, created_at, study_topic_id)
VALUES
    (
        'SUMMARY',
        'Example generated content. Gemini integration is pending.',
        NOW(6),
        1
    );
