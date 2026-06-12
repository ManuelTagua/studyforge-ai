package com.studyforge.backend.dto;

import com.studyforge.backend.model.GeneratedContent;
import com.studyforge.backend.model.GeneratedContentType;
import java.time.LocalDateTime;

public class GeneratedContentResponse {

    private Long id;
    private GeneratedContentType type;
    private String content;
    private LocalDateTime createdAt;

    public static GeneratedContentResponse fromEntity(GeneratedContent generatedContent) {
        GeneratedContentResponse response = new GeneratedContentResponse();
        response.setId(generatedContent.getId());
        response.setType(generatedContent.getType());
        response.setContent(generatedContent.getContent());
        response.setCreatedAt(generatedContent.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GeneratedContentType getType() {
        return type;
    }

    public void setType(GeneratedContentType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
