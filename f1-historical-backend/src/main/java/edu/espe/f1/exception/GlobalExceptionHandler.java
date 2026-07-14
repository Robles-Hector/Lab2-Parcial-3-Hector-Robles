package edu.espe.f1.exception;

import edu.espe.f1.dto.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j // Inyecta el logger automatizado de Lombok para la Fase 7
public class GlobalExceptionHandler {

    // 1. Captura errores manuales controlados (404 Not Found, 401 Unauthorized, 409 Conflict)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity handleResponseStatus(ResponseStatusException ex, HttpServletRequest request) {
        log.warn("⚠️ Operación rechazada [{}]: {}", ex.getStatusCode(), ex.getReason());
        
        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                ex.getStatusCode().value(),
                ex.getStatusCode().toString(),
                ex.getReason(),
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(error, ex.getStatusCode());
    }

    // 2. Captura violaciones de base de datos (Ej: Llaves duplicadas o restricciones F1)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("💥 Error de integridad en la Base de Datos Histórica: ", ex);
        
        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflict - Data Integrity",
                "Restricción de base de datos violada (registro duplicado o conflicto de llave foránea)",
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 3. Captura validaciones de campos fallidas (Ej: campos vacíos en Driver o Circuit usando @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map details = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            details.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        
        log.warn("📋 Datos de entrada inválidos en '{}'. Errores detectados: {}", request.getRequestURI(), details);

        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request - Validation Failed",
                "Los datos enviados no cumplen con las reglas de validación de la rúbrica",
                request.getRequestURI(),
                details
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 4. Fallback genérico para colapsos inesperados del sistema (500 Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("🚨 Error crítico no controlado en el servidor: ", ex);
        
        ErrorResponseDTO error = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Ocurrió un error inesperado en el backend de F1. Revisa los logs de la consola.",
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}