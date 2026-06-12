package com.studyforge.backend.service;

import com.studyforge.backend.dto.CreateStudyTopicRequest;
import com.studyforge.backend.model.StudyTopic;
import com.studyforge.backend.repository.StudyTopicRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class StudyTopicService {

    private final StudyTopicRepository studyTopicRepository;

    public StudyTopicService(StudyTopicRepository studyTopicRepository) {
        this.studyTopicRepository = studyTopicRepository;
    }

    @Transactional(readOnly = true)
    public List<StudyTopic> findAll() {
        return studyTopicRepository.findAll();
    }

    @Transactional(readOnly = true)
    public StudyTopic findById(Long id) {
        return studyTopicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Study topic not found"));
    }

    @Transactional
    public StudyTopic create(CreateStudyTopicRequest request) {
        StudyTopic topic = new StudyTopic();
        topic.setTitle(request.getTitle());
        topic.setOriginalText(request.getOriginalText());
        return studyTopicRepository.save(topic);
    }

    @Transactional
    public void delete(Long id) {
        StudyTopic topic = findById(id);
        studyTopicRepository.delete(topic);
    }
}
