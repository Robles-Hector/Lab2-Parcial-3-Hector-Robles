package edu.espe.f1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class F1HistoricalBackendApplication extends SpringBootServletInitializer {

    // Enlace obligatorio para que el contenedor de servlets externo (Tomcat) reconozca la app
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(F1HistoricalBackendApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(F1HistoricalBackendApplication.class, args);
    }
}