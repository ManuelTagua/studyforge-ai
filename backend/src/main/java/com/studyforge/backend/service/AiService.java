package com.studyforge.backend.service;

import com.studyforge.backend.model.GeneratedContent;
import com.studyforge.backend.model.GeneratedContentType;
import com.studyforge.backend.model.StudyTopic;
import com.studyforge.backend.repository.GeneratedContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiService {

    private final StudyTopicService studyTopicService;
    private final GeneratedContentRepository generatedContentRepository;

    public AiService(StudyTopicService studyTopicService, GeneratedContentRepository generatedContentRepository) {
        this.studyTopicService = studyTopicService;
        this.generatedContentRepository = generatedContentRepository;
    }

    @Transactional
    public GeneratedContent generate(Long topicId, GeneratedContentType type) {
        StudyTopic topic = studyTopicService.findById(topicId);

        GeneratedContent generatedContent = new GeneratedContent();
        generatedContent.setStudyTopic(topic);
        generatedContent.setType(type);
        generatedContent.setContent(buildPlaceholderContent(topic, type));

        return generatedContentRepository.save(generatedContent);
    }

    private String buildPlaceholderContent(StudyTopic topic, GeneratedContentType type) {
        return "Gemini integration pending for " + type + " on topic: " + topic.getTitle();
    }
}
