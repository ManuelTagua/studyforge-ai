package com.studyforge.backend.service;

import com.studyforge.backend.model.GeneratedContent;
import com.studyforge.backend.model.GeneratedContentType;
import com.studyforge.backend.model.StudyTopic;
import com.studyforge.backend.repository.GeneratedContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class AiService {

    private final StudyTopicService studyTopicService;
    private final GeneratedContentRepository generatedContentRepository;
    private final GeminiService geminiService;

    public AiService(
            StudyTopicService studyTopicService,
            GeneratedContentRepository generatedContentRepository,
            GeminiService geminiService
    ) {
        this.studyTopicService = studyTopicService;
        this.generatedContentRepository = generatedContentRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public GeneratedContent generate(Long topicId, GeneratedContentType type) {
        StudyTopic topic = studyTopicService.findById(topicId);
        String content = switch (type) {
            case SUMMARY -> geminiService.generateSummary(topic.getOriginalText());
            case QUIZ -> geminiService.generateQuiz(topic.getOriginalText());
            case FLASHCARDS -> geminiService.generateFlashcards(topic.getOriginalText());
            case SIMPLIFIED_EXPLANATION -> geminiService.generateSimplifiedExplanation(topic.getOriginalText());
            default -> throw new ResponseStatusException(BAD_REQUEST, "Esta generacion todavia no esta disponible.");
        };

        GeneratedContent generatedContent = new GeneratedContent();
        generatedContent.setStudyTopic(topic);
        generatedContent.setType(type);
        generatedContent.setContent(content);

        return generatedContentRepository.save(generatedContent);
    }
}
