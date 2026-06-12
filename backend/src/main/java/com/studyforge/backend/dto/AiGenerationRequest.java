package com.studyforge.backend.dto;

import jakarta.validation.constraints.NotNull;

public class AiGenerationRequest {

    @NotNull
    private Long topicId;

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
}
