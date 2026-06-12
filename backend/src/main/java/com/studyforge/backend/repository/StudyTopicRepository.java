package com.studyforge.backend.repository;

import com.studyforge.backend.model.StudyTopic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyTopicRepository extends JpaRepository<StudyTopic, Long> {
}
