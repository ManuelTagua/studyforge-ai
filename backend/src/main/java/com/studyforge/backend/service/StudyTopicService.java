package com.studyforge.backend.service;

import com.studyforge.backend.dto.CreateStudyTopicRequest;
import com.studyforge.backend.model.StudyTopic;
import com.studyforge.backend.repository.StudyTopicRepository;
import java.io.IOException;
import java.util.List;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
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
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "No se pudo encontrar este apunte."));
    }

    @Transactional
    public StudyTopic create(CreateStudyTopicRequest request) {
        return create(request.getTitle(), request.getOriginalText());
    }

    @Transactional
    public StudyTopic importPdf(MultipartFile file, String title) {
        validatePdf(file);

        String extractedText = extractText(file).trim();
        if (extractedText.isBlank()) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "No hemos podido extraer texto de este PDF. Puede que sea un PDF escaneado o basado en imágenes."
            );
        }

        String topicTitle = normalizeTitle(title, file.getOriginalFilename());
        return create(topicTitle, extractedText);
    }

    private StudyTopic create(String title, String originalText) {
        StudyTopic topic = new StudyTopic();
        topic.setTitle(title);
        topic.setOriginalText(originalText);
        return studyTopicRepository.save(topic);
    }

    private void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Selecciona un archivo PDF para importarlo.");
        }

        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        boolean hasPdfContentType = "application/pdf".equalsIgnoreCase(contentType);
        boolean hasPdfExtension = filename != null && filename.toLowerCase().endsWith(".pdf");

        if (!hasPdfContentType && !hasPdfExtension) {
            throw new ResponseStatusException(BAD_REQUEST, "El archivo seleccionado no es válido.");
        }
    }

    private String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getBytes())) {
            PDFTextStripper textStripper = new PDFTextStripper();
            return textStripper.getText(document);
        } catch (IOException exception) {
            throw new ResponseStatusException(BAD_REQUEST, "No se pudo completar la acción.", exception);
        }
    }

    private String normalizeTitle(String title, String filename) {
        if (title != null && !title.trim().isBlank()) {
            return trimToMaxLength(title.trim());
        }

        String fallbackTitle = filename == null || filename.isBlank() ? "Tema importado" : filename;
        int extensionIndex = fallbackTitle.toLowerCase().lastIndexOf(".pdf");
        if (extensionIndex > 0) {
            fallbackTitle = fallbackTitle.substring(0, extensionIndex);
        }

        return trimToMaxLength(fallbackTitle.trim().isBlank() ? "Tema importado" : fallbackTitle.trim());
    }

    private String trimToMaxLength(String value) {
        return value.length() <= 180 ? value : value.substring(0, 180);
    }

    @Transactional
    public void delete(Long id) {
        StudyTopic topic = findById(id);
        studyTopicRepository.delete(topic);
    }
}
