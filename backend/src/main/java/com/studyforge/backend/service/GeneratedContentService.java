package com.studyforge.backend.service;

import com.studyforge.backend.model.GeneratedContent;
import com.studyforge.backend.repository.GeneratedContentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GeneratedContentService {

    private final GeneratedContentRepository generatedContentRepository;

    public GeneratedContentService(GeneratedContentRepository generatedContentRepository) {
        this.generatedContentRepository = generatedContentRepository;
    }

    @Transactional(readOnly = true)
    public List<GeneratedContent> findByTopicId(Long topicId) {
        return generatedContentRepository.findByStudyTopicIdOrderByCreatedAtDesc(topicId);
    }
}
