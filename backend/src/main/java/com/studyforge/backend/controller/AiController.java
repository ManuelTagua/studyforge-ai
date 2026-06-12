package com.studyforge.backend.controller;

import com.studyforge.backend.dto.AiGenerationRequest;
import com.studyforge.backend.dto.GeneratedContentResponse;
import com.studyforge.backend.model.GeneratedContentType;
import com.studyforge.backend.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/summary")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateSummary(@Valid @RequestBody AiGenerationRequest request) {
        return generate(request, GeneratedContentType.SUMMARY);
    }

    @PostMapping("/summary/{topicId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateSummaryByTopicId(@PathVariable Long topicId) {
        return GeneratedContentResponse.fromEntity(aiService.generate(topicId, GeneratedContentType.SUMMARY));
    }

    @PostMapping("/quiz")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateQuiz(@Valid @RequestBody AiGenerationRequest request) {
        return generate(request, GeneratedContentType.QUIZ);
    }

    @PostMapping("/quiz/{topicId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateQuizByTopicId(@PathVariable Long topicId) {
        return GeneratedContentResponse.fromEntity(aiService.generate(topicId, GeneratedContentType.QUIZ));
    }

    @PostMapping("/flashcards")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateFlashcards(@Valid @RequestBody AiGenerationRequest request) {
        return generate(request, GeneratedContentType.FLASHCARDS);
    }

    @PostMapping("/flashcards/{topicId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateFlashcardsByTopicId(@PathVariable Long topicId) {
        return GeneratedContentResponse.fromEntity(aiService.generate(topicId, GeneratedContentType.FLASHCARDS));
    }

    @PostMapping("/explanation")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateExplanation(@Valid @RequestBody AiGenerationRequest request) {
        return generate(request, GeneratedContentType.SIMPLIFIED_EXPLANATION);
    }

    @PostMapping("/explanation/{topicId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GeneratedContentResponse generateExplanationByTopicId(@PathVariable Long topicId) {
        return GeneratedContentResponse.fromEntity(aiService.generate(topicId, GeneratedContentType.SIMPLIFIED_EXPLANATION));
    }

    private GeneratedContentResponse generate(AiGenerationRequest request, GeneratedContentType type) {
        return GeneratedContentResponse.fromEntity(aiService.generate(request.getTopicId(), type));
    }
}
