package com.studyforge.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class GeminiService {

    private static final String MODEL = "gemini-2.5-flash";
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/"
            + MODEL + ":generateContent";
    private static final Pattern CONVERSATIONAL_INTRO_PATTERN = Pattern.compile(
            "^\\s*(?:[#>*\\-\\s]*)?(?:[\\u00a1!\\u00bf?]*\\s*)?"
                    + "(?:claro que s[i\\u00ed]|por supuesto|aqu[i\\u00ed] tienes|te dejo|te explico|vamos a explicar|vamos a|a continuaci[o\\u00f3]n|este es|esta es)"
                    + "\\b[^\\n.?:!]*(?:[.?:!]+|\\n+|$)\\s*",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    private final String apiKey;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(
            @Value("${gemini.api.key:}") String apiKey,
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String generateSummary(String originalText) {
        return generateContent(buildSummaryPrompt(originalText), "resumen");
    }

    public String generateQuiz(String originalText) {
        return generateContent(buildQuizPrompt(originalText), "quiz");
    }

    public String generateFlashcards(String originalText) {
        return generateContent(buildFlashcardsPrompt(originalText), "flashcards");
    }

    public String generateSimplifiedExplanation(String originalText) {
        return generateContent(buildSimplifiedExplanationPrompt(originalText), "explicacion facil");
    }

    private String generateContent(String prompt, String contentName) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "No se pudo completar la acción. Inténtalo de nuevo en unos segundos."
            );
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "topP", 0.9
                )
        );

        try {
            String responseBody = restClient.post()
                    .uri(GEMINI_URL)
                    .header("x-goog-api-key", apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return extractText(responseBody, contentName);
        } catch (RestClientResponseException exception) {
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "No se pudo completar la acción. Inténtalo de nuevo en unos segundos.",
                    exception
            );
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "No se pudo completar la acción. Inténtalo de nuevo en unos segundos.",
                    exception
            );
        }
    }

    private String buildSummaryPrompt(String originalText) {
        return """
                Genera un resumen claro y estructurado del siguiente texto para estudiar.

                Requisitos:
                - No empieces con frases introductorias como "Claro que si", "Aqui tienes" o "Vamos a".
                - No incluyas saludos ni comentarios conversacionales.
                - Devuelve unicamente el contenido solicitado.
                - Usa Markdown limpio y bien estructurado.
                - Usa lenguaje sencillo.
                - Incluye los puntos importantes.
                - Organiza la respuesta con secciones utiles.
                - No inventes informacion que no este en el texto.
                - Si falta contexto, dilo claramente.

                Texto:
                %s
                """.formatted(originalText);
    }

    private String buildQuizPrompt(String originalText) {
        return """
                Genera un cuestionario tipo test basado unicamente en estos apuntes.

                Requisitos:
                - No empieces con frases introductorias como "Claro que si", "Aqui tienes" o "Vamos a".
                - No incluyas saludos ni comentarios conversacionales.
                - Devuelve unicamente el contenido solicitado.
                - Usa Markdown limpio y bien estructurado.
                - Crear entre 5 y 10 preguntas.
                - Cada pregunta debe tener 4 opciones: A, B, C y D.
                - Escribe cada pregunta, cada opcion y la respuesta correcta en lineas separadas.
                - Deja una linea en blanco entre preguntas.
                - Solo una opcion debe ser correcta.
                - Indicar la respuesta correcta debajo de cada pregunta.
                - Usar lenguaje claro y util para estudiar.
                - No inventar informacion que no aparezca en el texto.
                - Si el texto no tiene informacion suficiente, devolver un mensaje indicando que no se pueden generar preguntas fiables.

                Formato recomendado:

                1. Pregunta...
                A) ...
                B) ...
                C) ...
                D) ...
                Respuesta correcta: B

                Texto:
                %s
                """.formatted(originalText);
    }

    private String buildFlashcardsPrompt(String originalText) {
        return """
                Genera flashcards de estudio basadas unicamente en estos apuntes.

                Requisitos:
                - No saludes.
                - No uses frases conversacionales.
                - No digas "Claro que si".
                - No digas "Vamos a explicar".
                - No digas "Aqui tienes".
                - No empieces con frases introductorias como "Claro que si", "Aqui tienes" o "Vamos a".
                - Empieza directamente con el primer titulo o explicacion util.
                - Devuelve unicamente el contenido solicitado.
                - Usa Markdown limpio y bien estructurado.
                - Crear entre 8 y 15 flashcards.
                - Cada flashcard debe tener una pregunta y una respuesta.
                - Las preguntas deben ser claras.
                - Las respuestas deben ser breves pero utiles.
                - No inventar informacion que no aparezca en el texto.
                - Si el texto no tiene informacion suficiente, devolver un mensaje claro.

                Formato recomendado:

                Flashcard 1
                Pregunta: ...
                Respuesta: ...

                Flashcard 2
                Pregunta: ...
                Respuesta: ...

                Texto:
                %s
                """.formatted(originalText);
    }

    private String buildSimplifiedExplanationPrompt(String originalText) {
        return """
                Explica estos apuntes de forma sencilla.

                Requisitos:
                - No empieces con frases introductorias como "Claro que si", "Aqui tienes" o "Vamos a".
                - No incluyas saludos ni comentarios conversacionales.
                - Devuelve unicamente el contenido solicitado.
                - Usa Markdown limpio y bien estructurado.
                - Usar lenguaje facil de entender.
                - Explicarlo como si la persona estuviera empezando desde cero.
                - Mantener la informacion importante.
                - Poner ejemplos sencillos si ayudan.
                - No inventar informacion que no aparezca en el texto.
                - Organizar la explicacion en apartados claros.
                - Evitar tecnicismos innecesarios.

                Texto:
                %s
                """.formatted(originalText);
    }

    private String extractText(String responseBody, String contentName) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode parts = root.path("candidates").path(0).path("content").path("parts");
            StringBuilder content = new StringBuilder();

            if (parts.isArray()) {
                for (JsonNode part : parts) {
                    String text = part.path("text").asText("");
                    if (!text.isBlank()) {
                        content.append(text).append("\n");
                    }
                }
            }

            String generatedText = content.toString().trim();
            if (generatedText.isBlank()) {
                throw new ResponseStatusException(
                        BAD_GATEWAY,
                        "No se pudo completar la acción. Inténtalo de nuevo en unos segundos."
                );
            }

            String cleanGeneratedText = removeConversationalIntro(generatedText);
            if (cleanGeneratedText.isBlank()) {
                throw new ResponseStatusException(
                        BAD_GATEWAY,
                        "No se pudo completar la acción. Inténtalo de nuevo en unos segundos."
                );
            }

            return cleanGeneratedText;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "No se pudo completar la acción. Inténtalo de nuevo en unos segundos.",
                    exception
            );
        }
    }

    private String removeConversationalIntro(String generatedText) {
        String cleanGeneratedText = generatedText;
        while (CONVERSATIONAL_INTRO_PATTERN.matcher(cleanGeneratedText).find()) {
            cleanGeneratedText = CONVERSATIONAL_INTRO_PATTERN.matcher(cleanGeneratedText).replaceFirst("");
        }

        return cleanGeneratedText.trim();
    }
}
