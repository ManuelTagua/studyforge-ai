package com.studyforge.backend.dto;

import com.studyforge.backend.model.StudyTopic;
import java.time.LocalDateTime;

public class StudyTopicResponse {

    private Long id;
    private String title;
    private String originalText;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static StudyTopicResponse fromEntity(StudyTopic topic) {
        StudyTopicResponse response = new StudyTopicResponse();
        response.setId(topic.getId());
        response.setTitle(topic.getTitle());
        response.setOriginalText(topic.getOriginalText());
        response.setCreatedAt(topic.getCreatedAt());
        response.setUpdatedAt(topic.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
