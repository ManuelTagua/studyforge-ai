package com.studyforge.backend.controller;

import com.studyforge.backend.dto.CreateStudyTopicRequest;
import com.studyforge.backend.dto.GeneratedContentResponse;
import com.studyforge.backend.dto.StudyTopicResponse;
import com.studyforge.backend.service.GeneratedContentService;
import com.studyforge.backend.service.StudyTopicService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/topics")
public class StudyTopicController {

    private final StudyTopicService studyTopicService;
    private final GeneratedContentService generatedContentService;

    public StudyTopicController(StudyTopicService studyTopicService, GeneratedContentService generatedContentService) {
        this.studyTopicService = studyTopicService;
        this.generatedContentService = generatedContentService;
    }

    @GetMapping
    public List<StudyTopicResponse> findAll() {
        return studyTopicService.findAll().stream()
                .map(StudyTopicResponse::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public StudyTopicResponse findById(@PathVariable Long id) {
        return StudyTopicResponse.fromEntity(studyTopicService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudyTopicResponse create(@Valid @RequestBody CreateStudyTopicRequest request) {
        return StudyTopicResponse.fromEntity(studyTopicService.create(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        studyTopicService.delete(id);
    }

    @GetMapping("/{id}/contents")
    public List<GeneratedContentResponse> findContents(@PathVariable Long id) {
        studyTopicService.findById(id);
        return generatedContentService.findByTopicId(id).stream()
                .map(GeneratedContentResponse::fromEntity)
                .toList();
    }
}
