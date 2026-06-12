package com.studyforge.backend.repository;

import com.studyforge.backend.model.GeneratedContent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedContentRepository extends JpaRepository<GeneratedContent, Long> {

    List<GeneratedContent> findByStudyTopicIdOrderByCreatedAtDesc(Long studyTopicId);
}
